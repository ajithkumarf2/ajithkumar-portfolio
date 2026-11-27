import app from './app.js';
import { initDatabase } from './models/db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

async function startServer() {
  await initDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Portfolio MVC Backend Server running at http://localhost:${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Chat Stream: http://localhost:${PORT}/api/chat/stream`);
    console.log(`📫 Contact Endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`=======================================================`);
  });
}

startServer();
