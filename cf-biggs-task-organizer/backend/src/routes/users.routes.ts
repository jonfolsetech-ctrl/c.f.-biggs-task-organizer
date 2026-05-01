import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { query } from '../db.js';

export const usersRouter = Router();

usersRouter.get('/', authRequired, async (_req, res) => {
  const result = await query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY name ASC`
  );

  res.json({ users: result.rows });
});
