import { getPool, isDbConnected, getMemoryStore } from './db.js';

export class ChatModel {
  static async ensureSession(sessionId, ipHash = '') {
    if (isDbConnected()) {
      const pool = getPool();
      await pool.execute(
        'INSERT INTO chat_sessions (id, ip_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP',
        [sessionId, ipHash]
      );
    } else {
      const store = getMemoryStore();
      if (!store.sessions.has(sessionId)) {
        store.sessions.set(sessionId, { id: sessionId, ipHash, created_at: new Date() });
      }
    }
  }

  static async saveMessage({ sessionId, role, content, citations = [] }) {
    await this.ensureSession(sessionId);
    
    if (isDbConnected()) {
      const pool = getPool();
      const [result] = await pool.execute(
        'INSERT INTO chat_messages (session_id, role, content, citations) VALUES (?, ?, ?, ?)',
        [sessionId, role, content, JSON.stringify(citations)]
      );
      return { id: result.insertId, sessionId, role, content, citations, created_at: new Date() };
    } else {
      const store = getMemoryStore();
      const msg = {
        id: store.messages.length + 1,
        sessionId,
        role,
        content,
        citations,
        feedback: null,
        created_at: new Date()
      };
      store.messages.push(msg);
      return msg;
    }
  }

  static async updateFeedback({ messageId, feedback }) {
    if (isDbConnected()) {
      const pool = getPool();
      await pool.execute(
        'UPDATE chat_messages SET feedback = ? WHERE id = ?',
        [feedback, messageId]
      );
      return true;
    } else {
      const store = getMemoryStore();
      const msg = store.messages.find(m => m.id === Number(messageId) || m.id === messageId);
      if (msg) {
        msg.feedback = feedback;
        return true;
      }
      return false;
    }
  }
}
