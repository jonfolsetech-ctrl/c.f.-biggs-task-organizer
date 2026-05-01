import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { query } from '../db.js';

export const notificationsRouter = Router();

notificationsRouter.use(authRequired);

notificationsRouter.get('/', async (req, res) => {
  const result = await query(
    `SELECT n.*, t.title AS task_title
     FROM notifications n
     LEFT JOIN tasks t ON t.id = n.task_id
     WHERE n.user_id = $1
     ORDER BY n.created_at DESC
     LIMIT 50`,
    [req.user!.id]
  );

  res.json({ notifications: result.rows });
});

notificationsRouter.patch('/:id/read', async (req, res) => {
  const result = await query(
    `UPDATE notifications
     SET read_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [req.params.id, req.user!.id]
  );

  if (!result.rows[0]) return res.status(404).json({ message: 'Notification not found' });
  res.json({ notification: result.rows[0] });
});
