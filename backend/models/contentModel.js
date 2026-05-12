const { query } = require('../config/db');

const createContent = async ({ title, type, image, description, category, duration, director, price, roomNumber }) => {
  const { rows } = await query(
    `INSERT INTO contents(title, type, image, description, category, duration, director, price, room_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, title, type, image, description, category, duration, director, price,
       rating, room_number AS "roomNumber", sold_count AS "soldCount", revenue,
       created_at AS "createdAt", updated_at AS "updatedAt"`,
    [title, type, image, description, category, duration, director, price, roomNumber]
  );
  return rows[0];
};

const getAll = async (filter = {}) => {
  const values = [];
  let sql = `SELECT id, title, type, image, description, category, duration, director, price, rating, room_number AS "roomNumber", sold_count AS "soldCount", revenue, created_at AS "createdAt", updated_at AS "updatedAt" FROM contents`;

  if (filter.type) {
    values.push(filter.type);
    sql += ` WHERE type = $1`;
  }

  sql += ` ORDER BY created_at DESC`;
  const { rows } = await query(sql, values);
  return rows;
};

const findById = async (id) => {
  const { rows } = await query(
    `SELECT id, title, type, image, description, category, duration, director, price, rating, room_number AS "roomNumber", sold_count AS "soldCount", revenue, created_at AS "createdAt", updated_at AS "updatedAt" FROM contents WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
};

const deleteById = async (id) => {
  const { rows } = await query('DELETE FROM contents WHERE id = $1 RETURNING id', [id]);
  return rows[0] || null;
};

module.exports = {
  createContent,
  getAll,
  findById,
  deleteById,
};