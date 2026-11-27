import { getPool, isDbConnected, getMemoryStore } from './db.js';

export class AnalyticsModel {
  static async recordEvent({ eventType, eventData = {} }) {
    if (isDbConnected()) {
      const pool = getPool();
      await pool.execute(
        'INSERT INTO analytics_events (event_type, event_data) VALUES (?, ?)',
        [eventType, JSON.stringify(eventData)]
      );
    } else {
      const store = getMemoryStore();
      store.analytics.push({
        id: store.analytics.length + 1,
        eventType,
        eventData,
        created_at: new Date()
      });
    }
  }

  static async getSummary() {
    if (isDbConnected()) {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT event_type, COUNT(*) as count FROM analytics_events GROUP BY event_type'
      );
      return rows;
    } else {
      const store = getMemoryStore();
      const counts = {};
      for (const e of store.analytics) {
        counts[e.eventType] = (counts[e.eventType] || 0) + 1;
      }
      return Object.entries(counts).map(([event_type, count]) => ({ event_type, count }));
    }
  }
}
