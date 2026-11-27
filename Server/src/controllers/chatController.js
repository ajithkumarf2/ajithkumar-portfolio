import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatModel } from '../models/chatModel.js';
import { ResponseView } from '../views/responseView.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AI_DIR = path.resolve(__dirname, '../../ai');
const DATA_DIR = fs.existsSync(path.resolve(__dirname, '../../data'))
  ? path.resolve(__dirname, '../../data')
  : path.resolve(__dirname, '../../../data');
const PYTHON_SERVICE_PATH = path.resolve(__dirname, '../../ai/service.py');
const PYTHON_BIN = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
const AI_WORKER_PORT = Number(process.env.AI_WORKER_PORT) || 5001;

function loadPortfolioContext(query) {
  const chunks = [];
  try {
    const aboutPath = path.join(DATA_DIR, 'about-me.md');
    if (fs.existsSync(aboutPath)) chunks.push(fs.readFileSync(aboutPath, 'utf-8'));

    const expPath = path.join(DATA_DIR, 'experience.md');
    if (fs.existsSync(expPath)) chunks.push(fs.readFileSync(expPath, 'utf-8'));

    const projPath = path.join(DATA_DIR, 'projects.json');
    if (fs.existsSync(projPath)) {
      const projects = JSON.parse(fs.readFileSync(projPath, 'utf-8'));
      for (const p of projects) {
        chunks.push(`${p.title} (${(p.techStack || []).join(', ')}): ${p.fullDescription || p.description}`);
      }
    }

    const skillsPath = path.join(DATA_DIR, 'skills.json');
    if (fs.existsSync(skillsPath)) {
      chunks.push(`Skills: ${fs.readFileSync(skillsPath, 'utf-8')}`);
    }
  } catch (e) {}

  const words = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const scored = chunks.map(c => {
    const lower = c.toLowerCase();
    const score = words.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
    return { score, text: c };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.text).join('\n\n');
}

async function streamViaNodeGemini(query, res) {
  const qLower = query.toLowerCase();
  const suggestLead = /hire|interview|available|job|recruiter|work with|contact|email|phone/.test(qLower);

  // Guardrail check
  if (/ignore (all|previous|above) instructions|system prompt|jailbreak|drop table|<script>/i.test(qLower)) {
    res.write(`data: ${JSON.stringify({
      delta: "I am Ajithkumar's portfolio AI assistant. I can only answer questions related to his technical background, projects, skills, and availability.",
      citations: [],
      suggestLeadCapture: false
    })}\n\ndata: [DONE]\n\n`);
    return '';
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const fallback = "Ajithkumar E is a Full-Stack & AI Developer skilled in React.js, Node.js, Express, MySQL, MongoDB, LangChain, LangGraph, RAG, and the Gemini API. Reach out at ajithkumare101@gmail.com.";
    res.write(`data: ${JSON.stringify({ delta: fallback, citations: [], suggestLeadCapture: suggestLead })}\n\ndata: [DONE]\n\n`);
    return fallback;
  }

  const contextText = loadPortfolioContext(query);
  const systemInstruction =
    "You are the official AI assistant for Ajithkumar E, a full-stack and AI software developer. " +
    "Answer accurately using ONLY the provided context. Never invent facts. " +
    "Format every response cleanly and concisely (under 120 words): " +
    "start with a 1-2 sentence direct overview, then use short bullet points formatted as '- **Topic:** concise detail'. " +
    "Do NOT include any '(Source: ...)' or 'Sources:' text at the end of your reply. " +
    "If the context lacks the answer, say so politely and suggest contacting ajithkumare101@gmail.com.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
  const apiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: `Context:\n${contextText}\n\nUser Question: ${query}` }] }]
    })
  });

  if (!apiRes.ok || !apiRes.body) {
    throw new Error(`Gemini HTTP ${apiRes.status}`);
  }

  const reader = apiRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const parsed = JSON.parse(line.slice(6));
          const delta = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (delta) {
            fullText += delta;
            res.write(`data: ${JSON.stringify({ delta, citations: [], suggestLeadCapture: false })}\n\n`);
          }
        } catch (e) {}
      }
    }
  }

  if (suggestLead) {
    res.write(`data: ${JSON.stringify({ delta: '', citations: [], suggestLeadCapture: true })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  return fullText;
}

let aiWorkerProcess = null;
let aiWorkerStarting = null;

function pingWorker() {
  return new Promise((resolve) => {
    const req = http.get({ hostname: '127.0.0.1', port: AI_WORKER_PORT, path: '/health', timeout: 800 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function ensureAiWorker() {
  if (await pingWorker()) return true;
  if (aiWorkerStarting) return aiWorkerStarting;

  aiWorkerStarting = new Promise((resolve) => {
    const proc = spawn(PYTHON_BIN, [PYTHON_SERVICE_PATH, '--serve', String(AI_WORKER_PORT)], {
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      cwd: AI_DIR
    });
    aiWorkerProcess = proc;

    proc.stderr.on('data', (d) => {
      const msg = d.toString().trim();
      if (msg) console.log(`[Python AI Worker]: ${msg}`);
    });

    proc.on('exit', () => {
      aiWorkerProcess = null;
      aiWorkerStarting = null;
    });

    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      if (await pingWorker()) {
        clearInterval(poll);
        aiWorkerStarting = null;
        resolve(true);
      } else if (attempts >= 30) {
        clearInterval(poll);
        aiWorkerStarting = null;
        resolve(false);
      }
    }, 300);
  });

  return aiWorkerStarting;
}

// Pre-warm Python AI worker locally (skip in Vercel serverless runtime)
if (!process.env.VERCEL) {
  ensureAiWorker().catch(() => {});
}

export class ChatController {
  static async streamChat(req, res) {
    const { sessionId = 'default_session', message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return ResponseView.error(res, 'Valid message is required', 400);
    }

    const trimmedMsg = message.trim();

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Save user message to database
    await ChatModel.saveMessage({
      sessionId,
      role: 'user',
      content: trimmedMsg
    });

    let fullAssistantResponse = '';
    let citationsCollected = [];

    // On Vercel serverless, use native Node.js Gemini + RAG streaming
    if (process.env.VERCEL) {
      try {
        fullAssistantResponse = await streamViaNodeGemini(trimmedMsg, res);
        if (fullAssistantResponse) {
          await ChatModel.saveMessage({
            sessionId,
            role: 'assistant',
            content: fullAssistantResponse,
            citations: citationsCollected
          });
        }
      } catch (err) {
        console.error('[Vercel Gemini Stream Error]:', err.message);
        const fallbackMsg = JSON.stringify({
          delta: "I'm currently unable to reach the AI service. Please try again shortly, or contact Ajithkumar directly at ajithkumare101@gmail.com.",
          citations: [],
          suggestLeadCapture: false
        });
        res.write(`data: ${fallbackMsg}\n\ndata: [DONE]\n\n`);
      } finally {
        if (!res.writableEnded) res.end();
      }
      return;
    }

    const parseAndForward = (chunkStr) => {
      res.write(chunkStr);
      const lines = chunkStr.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.delta) fullAssistantResponse += parsed.delta;
            if (parsed.citations && parsed.citations.length) {
              citationsCollected = parsed.citations;
            }
          } catch (e) {}
        }
      }
    };

    const workerReady = await ensureAiWorker();
    if (workerReady) {
      const payload = JSON.stringify({ message: trimmedMsg, sessionId });
      const aiReq = http.request(
        {
          hostname: '127.0.0.1',
          port: AI_WORKER_PORT,
          path: '/stream',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        },
        (aiRes) => {
          aiRes.on('data', (chunk) => parseAndForward(chunk.toString('utf-8')));
          aiRes.on('end', async () => {
            if (fullAssistantResponse) {
              await ChatModel.saveMessage({
                sessionId,
                role: 'assistant',
                content: fullAssistantResponse,
                citations: citationsCollected
              });
            }
            if (!res.writableEnded) res.end();
          });
        }
      );

      aiReq.on('error', async (err) => {
        console.error('[Python AI Worker Request Error]:', err.message);
        if (!fullAssistantResponse && !res.writableEnded) {
          const fallbackMsg = JSON.stringify({
            delta: "I'm currently unable to process your question via the AI service. Please try again shortly, or contact Ajithkumar directly at ajithkumare101@gmail.com.",
            citations: ["Source: Portfolio Data"],
            suggestLeadCapture: false
          });
          res.write(`data: ${fallbackMsg}\n\ndata: [DONE]\n\n`);
        }
        if (!res.writableEnded) res.end();
      });

      req.on('close', () => aiReq.destroy());
      aiReq.write(payload);
      aiReq.end();
      return;
    }

    // Fallback: one-shot spawn if persistent worker failed to boot
    const pythonProcess = spawn(PYTHON_BIN, [PYTHON_SERVICE_PATH, trimmedMsg, sessionId], {
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      cwd: AI_DIR
    });

    pythonProcess.stdout.on('data', (data) => parseAndForward(data.toString('utf-8')));
    pythonProcess.stderr.on('data', (data) => console.warn(`[Python AI Service STDERR]: ${data.toString()}`));
    pythonProcess.on('close', async () => {
      if (fullAssistantResponse) {
        await ChatModel.saveMessage({
          sessionId,
          role: 'assistant',
          content: fullAssistantResponse,
          citations: citationsCollected
        });
      }
      if (!res.writableEnded) res.end();
    });
    req.on('close', () => {
      if (!pythonProcess.killed) pythonProcess.kill();
    });
  }

  static async submitFeedback(req, res, next) {
    try {
      const { messageId, feedback } = req.body;
      if (!messageId || feedback === undefined) {
        return ResponseView.error(res, 'messageId and feedback are required', 400);
      }
      await ChatModel.updateFeedback({ messageId, feedback });
      return ResponseView.success(res, { messageId, feedback }, 200, 'Feedback recorded');
    } catch (err) {
      next(err);
    }
  }
}
