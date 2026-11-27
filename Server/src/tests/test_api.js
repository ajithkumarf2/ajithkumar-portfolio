import http from 'http';
import app from '../app.js';
import { initDatabase } from '../models/db.js';

async function runTests() {
  console.log('--- Starting Backend & Python AI Integration Tests ---');
  await initDatabase();

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5099, '127.0.0.1', resolve));
  console.log('Test server listening on port 5099');

  try {
    // 1. Health check
    console.log('\n[Test 1] Testing GET /api/health...');
    const healthRes = await makeRequest('http://127.0.0.1:5099/api/health', 'GET');
    console.log('Status:', healthRes.status);
    console.log('Response:', healthRes.data);
    if (healthRes.status !== 200 || !healthRes.data.success) {
      throw new Error('Health check test failed');
    }
    console.log('✓ Health check passed');

    // 2. Contact submission
    console.log('\n[Test 2] Testing POST /api/contact...');
    const contactRes = await makeRequest('http://127.0.0.1:5099/api/contact', 'POST', {
      name: 'Test Recruiter',
      email: 'recruiter@techcorp.com',
      message: 'Hello Ajithkumar, we have an exciting Full-Stack role.',
      source: 'automated_test'
    });
    console.log('Status:', contactRes.status);
    console.log('Response:', contactRes.data);
    if (contactRes.status !== 201 || !contactRes.data.success) {
      throw new Error('Contact submission test failed');
    }
    console.log('✓ Contact submission passed');

    // 3. Analytics event
    console.log('\n[Test 3] Testing POST /api/analytics...');
    const analyticsRes = await makeRequest('http://127.0.0.1:5099/api/analytics', 'POST', {
      eventType: 'project_click',
      eventData: { projectId: 'ai-task-manager' }
    });
    console.log('Status:', analyticsRes.status);
    console.log('Response:', analyticsRes.data);
    if (analyticsRes.status !== 200 || !analyticsRes.data.success) {
      throw new Error('Analytics test failed');
    }
    console.log('✓ Analytics logging passed');

    // 4. Chat streaming with Python LangGraph RAG
    console.log('\n[Test 4] Testing POST /api/chat/stream with Python LangGraph...');
    const chatStreamData = await makeStreamRequest('http://127.0.0.1:5099/api/chat/stream', {
      sessionId: 'test_session_123',
      message: 'What has he built with RAG?'
    });
    console.log('Stream chunks count:', chatStreamData.chunks.length);
    console.log('Full Streamed Text Preview:', chatStreamData.fullText.substring(0, 150) + '...');
    if (!chatStreamData.fullText.toLowerCase().includes('task manager') && !chatStreamData.fullText.toLowerCase().includes('rag')) {
      throw new Error('Chat streaming did not return expected RAG answer');
    }
    console.log('✓ Python LangGraph RAG chat stream passed');

    // 5. Feedback recording
    console.log('\n[Test 5] Testing POST /api/chat/feedback...');
    const feedbackRes = await makeRequest('http://127.0.0.1:5099/api/chat/feedback', 'POST', {
      messageId: 1,
      feedback: 1
    });
    console.log('Status:', feedbackRes.status);
    console.log('Response:', feedbackRes.data);
    if (feedbackRes.status !== 200 || !feedbackRes.data.success) {
      throw new Error('Feedback submission test failed');
    }
    console.log('✓ Feedback recording passed');

    console.log('\n===========================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('===========================================');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(process.exitCode || 0);
  }
}

function makeRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function makeStreamRequest(url, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let fullText = '';
      const chunks = [];

      res.on('data', (chunk) => {
        const text = chunk.toString('utf-8');
        chunks.push(text);
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.delta) fullText += parsed.delta;
            } catch (e) {}
          }
        }
      });

      res.on('end', () => {
        resolve({ fullText, chunks });
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

runTests();
