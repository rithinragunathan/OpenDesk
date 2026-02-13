import { pool } from '../db.js';

export async function listIssues(_req, res) {
  const { rows } = await pool.query(
    `SELECT i.*, u.full_name, u.avatar_url
     FROM issues i
     JOIN users u ON u.id = i.created_by
     ORDER BY i.created_at DESC`
  );

  return res.json(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      severity: row.severity,
      status: row.status,
      latitude: row.latitude,
      longitude: row.longitude,
      createdAt: row.created_at,
      reportedBy: row.full_name,
      reporterAvatar: row.avatar_url
    }))
  );
}

export async function createIssue(req, res) {
  const { title, description, category, severity, latitude, longitude } = req.body;

  if (!title || !description || !category || !severity) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ message: 'Valid latitude and longitude are required.' });
  }

  const { rows } = await pool.query(
    `INSERT INTO issues(title, description, category, severity, latitude, longitude, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [title, description, category, severity, latitude, longitude, req.user.id]
  );

  return res.status(201).json(rows[0]);
}
