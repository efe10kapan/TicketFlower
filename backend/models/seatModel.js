const { query } = require('../config/db');

const insertMany = async (seatRows) => {
  if (!seatRows || seatRows.length === 0) {
    return [];
  }

  const placeholders = [];
  const values = [];

  seatRows.forEach((seat, index) => {
    const base = index * 6;
    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`);
    values.push(
      seat.contentId,
      seat.userId || null,
      seat.row,
      seat.number,
      seat.status || 'empty',
      seat.pricePaid || 0
    );
  });

  const sql = `INSERT INTO seats(content_id, user_id, row, number, status, price_paid)
    VALUES ${placeholders.join(', ')} RETURNING id, content_id AS "contentId", user_id AS "userId", row, number, status, ticket_type AS "ticketType", price_paid AS "pricePaid", created_at AS "createdAt", updated_at AS "updatedAt"`;

  const { rows } = await query(sql, values);
  return rows;
};

const findByContentId = async (contentId) => {
  const { rows } = await query(
    `SELECT id, content_id AS "contentId", user_id AS "userId", row, number, status, ticket_type AS "ticketType", price_paid AS "pricePaid", created_at AS "createdAt", updated_at AS "updatedAt"
     FROM seats WHERE content_id = $1 ORDER BY row, number`,
    [contentId]
  );
  return rows;
};

const deleteByContentId = async (contentId) => {
  await query('DELETE FROM seats WHERE content_id = $1', [contentId]);
};

module.exports = {
  insertMany,
  findByContentId,
  deleteByContentId,
};