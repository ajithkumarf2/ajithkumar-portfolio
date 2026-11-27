import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// In-memory fallback store if external MySQL is not yet configured/available
const inMemoryStore = {
  leads: [],
  sessions: new Map(),
  messages: [],
  analytics: [],
  question_logs: []
};

let pool = null;
let isConnected = false;

// Attempt MySQL connection if credentials provided
const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'portfolio_db',
  DB_PORT = 3306,
  DB_SSL
} = process.env;

function getSslConfig() {
  if (DB_SSL === 'false') return undefined;
  if (DB_SSL === 'true' || (DB_HOST !== 'localhost' && DB_HOST !== '127.0.0.1')) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

export async function initDatabase() {
  try {
    const ssl = getSslConfig();
    const bootstrapPool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: Number(DB_PORT),
      ssl,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });

    const connection = await bootstrapPool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.query(`USE \`${DB_NAME}\`;`);
    
    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id VARCHAR(64) PRIMARY KEY,
        ip_hash VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(64) NOT NULL,
        role ENUM('user', 'assistant', 'system') NOT NULL,
        content TEXT NOT NULL,
        citations JSON,
        feedback TINYINT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'contact_form',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(64) NOT NULL,
        event_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS question_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(64) DEFAULT NULL,
        question TEXT NOT NULL,
        intent_classified VARCHAR(64) DEFAULT NULL,
        guardrail_status VARCHAR(20) DEFAULT 'passed',
        retrieved_chunk_count INT DEFAULT 0,
        latency_ms INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    connection.release();
    await bootstrapPool.end();

    // Create main pool bound directly to DB_NAME so all model queries work across connections
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: Number(DB_PORT),
      ssl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    isConnected = true;
    console.log(`[Database] MySQL connected successfully to ${DB_NAME} at ${DB_HOST}:${DB_PORT}`);
  } catch (err) {
    console.warn(`[Database] MySQL not reachable (${err.message}). Using high-performance in-memory persistence fallback for immediate operation.`);
    isConnected = false;
  }
}

export function getPool() {
  return pool;
}

export function isDbConnected() {
  return isConnected;
}

export function getMemoryStore() {
  return inMemoryStore;
}
