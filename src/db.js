// MySQL connection pool + query helpers.
// Pure-JS mysql2 (no native addons) so it installs on restricted shared hosts.
const mysql = require('mysql2/promise');

// Hostinger/CloudLinux gotcha: Node resolves "localhost" to IPv6 ::1, but the
// DB user is usually granted on IPv4 -> "Access denied ... @'::1'". Force IPv4.
let host = process.env.DB_HOST || '127.0.0.1';
if (host === 'localhost') host = '127.0.0.1';

const pool = mysql.createPool({
  host,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trendz',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL || 10),
  queueLimit: 0,
  charset: 'utf8mb4',
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}

module.exports = { pool, query, queryOne, ping };
