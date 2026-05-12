// backend/config/db.js
const { Pool } = require('pg');

let pool;

const connectDB = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined. Please add it to backend/.env or your deployment environment.');
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await pool.connect();
    console.log('PostgreSQL bağlandı (Neon DB)');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT false,
        balance NUMERIC(10,2) NOT NULL DEFAULT 500,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS contents (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        image TEXT,
        description TEXT,
        category TEXT,
        duration INTEGER,
        director TEXT,
        price NUMERIC(10,2) NOT NULL,
        rating NUMERIC(3,1) NOT NULL DEFAULT 0,
        room_number INTEGER NOT NULL DEFAULT 1,
        sold_count INTEGER NOT NULL DEFAULT 0,
        revenue NUMERIC(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS seats (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        row TEXT NOT NULL,
        number INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'empty',
        ticket_type TEXT NOT NULL DEFAULT 'none',
        price_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Veritabanı tabloları hazır.');
  } catch (error) {
    console.error(`PostgreSQL bağlantısı başarısız: ${error.message}`);
    process.exit(1);
  }
};

const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database pool is not initialized. Call connectDB() before using query().');
  }
  return pool.query(text, params);
};

module.exports = { connectDB, query };