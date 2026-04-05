const { Pool } = require('pg');
require('dotenv').config();
const logger = require('../src/utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', { err: err.message, stack: err.stack });
  process.exit(-1);
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Query executed', {
      text: text.substring(0, 80),
      duration: `${duration}ms`,
      rows: res.rowCount,
    });
  }
  return res;
}

async function getClient() {
  return pool.connect();
}

async function disconnect() {
  await pool.end();
}

module.exports = { pool, query, getClient, disconnect };
