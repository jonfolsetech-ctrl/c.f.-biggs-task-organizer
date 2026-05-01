import cron from 'node-cron';
import { query } from '../db.js';
import { sendReminderEmail } from './mail.service.js';

export function startReminderWorker() {
  cron.schedule('* * * * *', async () => {
    try {
      const result = await query(
        `SELECT
          t.id,
          t.title,
          t.due_at,
          t.assigned_to,
          u.email
         FROM tasks t
         JOIN users u ON u.id = t.assigned_to
         WHERE t.status <> 'COMPLETED'
           AND t.reminder_at IS NOT NULL
           AND t.reminder_at <= NOW()
           AND t.reminder_sent = FALSE
         LIMIT 25`
      );

      for (const task of result.rows) {
        const dueText = task.due_at ? new Date(task.due_at).toLocaleString() : 'soon';

        await query(
          `INSERT INTO notifications (user_id, task_id, title, body)
           VALUES ($1, $2, $3, $4)`,
          [task.assigned_to, task.id, 'Task reminder', `Reminder: "${task.title}" is due ${dueText}.`]
        );

        await sendReminderEmail(task.email, task.title, task.due_at);
        await query(`UPDATE tasks SET reminder_sent = TRUE WHERE id = $1`, [task.id]);
      }
    } catch (error) {
      console.error('Reminder worker error:', error);
    }
  });
}
