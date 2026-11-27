import { isDbConnected } from '../models/db.js';
import { ResponseView } from '../views/responseView.js';

export class HealthController {
  static getHealth(req, res) {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: isDbConnected() ? 'connected (MySQL)' : 'in-memory fallback (active)',
      aiEngine: 'Python LangGraph + RAG (Ready)',
      environment: process.env.NODE_ENV || 'development'
    };
    return ResponseView.success(res, health);
  }
}
