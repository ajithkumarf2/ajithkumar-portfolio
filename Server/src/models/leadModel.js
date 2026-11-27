import { getPool, isDbConnected, getMemoryStore } from './db.js';

export class LeadModel {
  static async createLead({ name, email, message, source = 'contact_form' }) {
    if (isDbConnected()) {
      const pool = getPool();
      const [result] = await pool.execute(
        'INSERT INTO leads (name, email, message, source) VALUES (?, ?, ?, ?)',
        [name, email, message, source]
      );
      return { id: result.insertId, name, email, message, source, created_at: new Date() };
    } else {
      const store = getMemoryStore();
      const lead = {
        id: store.leads.length + 1,
        name,
        email,
        message,
        source,
        created_at: new Date()
      };
      store.leads.push(lead);
      return lead;
    }
  }

  static async getAllLeads() {
    if (isDbConnected()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
      return rows;
    } else {
      return getMemoryStore().leads;
    }
  }
}
