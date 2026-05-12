const { query } = require('../config/db');

const findByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await query(
    `SELECT id, name, email, is_admin AS "isAdmin", balance, created_at AS "createdAt", updated_at AS "updatedAt" FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const createUser = async ({ name, email, password, isAdmin = false, balance = 500 }) => {
  const { rows } = await query(
    `INSERT INTO users(name, email, password, is_admin, balance)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, is_admin AS "isAdmin", balance`,
    [name, email, password, isAdmin, balance]
  );
  return rows[0];
};

module.exports = {
  findByEmail,
  findById,
  createUser,
};