import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatModel } from '../models/chatModel.js';
import { ResponseView } from '../views/responseView.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AI_DIR = path.resolve(__dirname, '../../ai');
const PYTHON_SERVICE_PATH = path.resolve(__dirname, '../../ai/service.py');
const PYTHON_BIN = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
const AI_WORKER_PORT = Number(process.env.AI_WORKER_PORT) || 5001;

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

// Pre-warm Python AI worker in background at server boot
ensureAiWorker().catch(() => {});

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
