import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { query } from '../db.js';
import { commentSchema, taskSchema } from '../validators/task.schema.js';

export const tasksRouter = Router();

tasksRouter.use(authRequired);

function canViewAll(role?: string) {
  return role === 'MANAGER' || role === 'ADMIN';
}

tasksRouter.get('/', async (req, res) => {
  const { status, priority, assignee, search, dueFrom, dueTo } = req.query;
  const params: unknown[] = [];
  const where: string[] = [];

  if (!canViewAll(req.user?.role)) {
    params.push(req.user!.id);
    where.push(`(t.assigned_to = $${params.length} OR t.created_by = $${params.length})`);
  }

  if (status) {
    params.push(status);
    where.push(`t.status = $${params.length}`);
  }

  if (priority) {
    params.push(priority);
    where.push(`t.priority = $${params.length}`);
  }

  if (assignee) {
    params.push(assignee);
    where.push(`t.assigned_to = $${params.length}`);
  }

  if (search) {
    params.push(`%${String(search).toLowerCase()}%`);
    where.push(`(LOWER(t.title) LIKE $${params.length} OR LOWER(COALESCE(t.description, '')) LIKE $${params.length})`);
  }

  if (dueFrom) {
    params.push(dueFrom);
    where.push(`t.due_at >= $${params.length}`);
  }

  if (dueTo) {
    params.push(dueTo);
    where.push(`t.due_at <= $${params.length}`);
  }

  const result = await query(
    `SELECT
      t.*,
      creator.name AS created_by_name,
      assignee_user.name AS assigned_to_name,
      assignee_user.email AS assigned_to_email
    FROM tasks t
    JOIN users creator ON creator.id = t.created_by
    LEFT JOIN users assignee_user ON assignee_user.id = t.assigned_to
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY
      CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END,
      t.due_at ASC NULLS LAST,
      t.created_at DESC`,
    params
  );

  res.json({ tasks: result.rows });
});

tasksRouter.get('/stats', async (req, res) => {
  const params: unknown[] = [];
  const where: string[] = [];

  if (!canViewAll(req.user?.role)) {
    params.push(req.user!.id);
    where.push(`(assigned_to = $${params.length} OR created_by = $${params.length})`);
  }

  const scope = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const result = await query(
    `SELECT
      COUNT(*) FILTER (WHERE assigned_to = $${params.push(req.user!.id)})::int AS assigned_count,
      COUNT(*) FILTER (WHERE created_by = $${params.push(req.user!.id)})::int AS created_count,
      COUNT(*) FILTER (WHERE due_at < NOW() AND status <> 'COMPLETED')::int AS overdue_count,
      COUNT(*) FILTER (WHERE due_at >= NOW() AND due_at <= NOW() + INTERVAL '7 days' AND status <> 'COMPLETED')::int AS upcoming_count,
      COUNT(*) FILTER (WHERE status = 'COMPLETED')::int AS completed_count
     FROM tasks
     ${scope}`,
    params
  );

  res.json({ stats: result.rows[0] });
});

tasksRouter.post('/', async (req, res) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid task', errors: parsed.error.flatten() });

  const task = parsed.data;
  const result = await query(
    `INSERT INTO tasks (title, description, created_by, assigned_to, due_at, reminder_at, priority, status, completed_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CASE WHEN $8 = 'COMPLETED' THEN NOW() ELSE NULL END)
     RETURNING *`,
    [task.title, task.description || null, req.user!.id, task.assignedTo || null, task.dueAt || null, task.reminderAt || null, task.priority, task.status]
  );

  res.status(201).json({ task: result.rows[0] });
});

tasksRouter.put('/:id', async (req, res) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid task', errors: parsed.error.flatten() });

  const existing = await query(`SELECT * FROM tasks WHERE id = $1`, [req.params.id]);
  const task = existing.rows[0];
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const isOwner = task.created_by === req.user!.id || task.assigned_to === req.user!.id;
  if (!canViewAll(req.user?.role) && !isOwner) {
    return res.status(403).json({ message: 'Not allowed to edit this task' });
  }

  const data = parsed.data;
  const result = await query(
    `UPDATE tasks
     SET title = $1,
         description = $2,
         assigned_to = $3,
         due_at = $4,
         reminder_at = $5,
         reminder_sent = CASE WHEN reminder_at IS DISTINCT FROM $5 THEN FALSE ELSE reminder_sent END,
         priority = $6,
         status = $7,
         completed_at = CASE WHEN $7 = 'COMPLETED' AND completed_at IS NULL THEN NOW() WHEN $7 <> 'COMPLETED' THEN NULL ELSE completed_at END,
         updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [data.title, data.description || null, data.assignedTo || null, data.dueAt || null, data.reminderAt || null, data.priority, data.status, req.params.id]
  );

  res.json({ task: result.rows[0] });
});

tasksRouter.patch('/:id/complete', async (req, res) => {
  const existing = await query(`SELECT * FROM tasks WHERE id = $1`, [req.params.id]);
  const task = existing.rows[0];
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const isOwner = task.created_by === req.user!.id || task.assigned_to === req.user!.id;
  if (!canViewAll(req.user?.role) && !isOwner) {
    return res.status(403).json({ message: 'Not allowed to complete this task' });
  }

  const result = await query(
    `UPDATE tasks
     SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [req.params.id]
  );

  res.json({ task: result.rows[0] });
});

tasksRouter.delete('/:id', async (req, res) => {
  const existing = await query(`SELECT * FROM tasks WHERE id = $1`, [req.params.id]);
  const task = existing.rows[0];
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (!canViewAll(req.user?.role) && task.created_by !== req.user!.id) {
    return res.status(403).json({ message: 'Only the task creator or manager can delete this task' });
  }

  await query(`DELETE FROM tasks WHERE id = $1`, [req.params.id]);
  res.json({ message: 'Task deleted' });
});

tasksRouter.get('/:id/comments', async (req, res) => {
  const result = await query(
    `SELECT c.*, u.name AS user_name
     FROM task_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.task_id = $1
     ORDER BY c.created_at ASC`,
    [req.params.id]
  );

  res.json({ comments: result.rows });
});

tasksRouter.post('/:id/comments', async (req, res) => {
  const parsed = commentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid comment' });

  const result = await query(
    `INSERT INTO task_comments (task_id, user_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [req.params.id, req.user!.id, parsed.data.body]
  );

  res.status(201).json({ comment: result.rows[0] });
});
