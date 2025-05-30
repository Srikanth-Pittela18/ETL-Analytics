import pool from '../config/db.js';
import { fetchSearchAnalytics } from '../service/searchService.js';
 
export async function fetchAndStore(req, res) {
  try {
    const rows = await fetchSearchAnalytics();
 
    if (!rows.length) {
      return res.json({ message: 'No analytics data found.' });
    }
 
    const connection = await pool.getConnection();
 
    try {
      const sql = `
        INSERT INTO search_metrics (date, page, clicks, impressions, ctr, position)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          clicks = VALUES(clicks),
          impressions = VALUES(impressions),
          ctr = VALUES(ctr),
          position = VALUES(position)
      `;
 
      for (const row of rows) {
        await connection.execute(sql, [
          row.date,
          row.page,
          row.clicks,
          row.impressions,
          row.ctr,
          row.position,
        ]);
      }
    } finally {
      connection.release();
    }
 
    res.json({ message: `Successfully stored ${rows.length} rows.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch or store data.' });
  }
}