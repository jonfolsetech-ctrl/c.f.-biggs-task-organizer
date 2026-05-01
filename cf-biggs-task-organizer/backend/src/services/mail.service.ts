import nodemailer from 'nodemailer';
import { config } from '../config.js';

export async function sendReminderEmail(to: string, taskTitle: string, dueAt: string | null) {
  if (!config.enableEmailReminders) return;
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) return;

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });

  const dueText = dueAt ? new Date(dueAt).toLocaleString() : 'soon';

  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject: `Task Reminder: ${taskTitle}`,
    text: `Reminder: The task "${taskTitle}" is due ${dueText}.`,
    html: `<p><strong>Reminder:</strong> The task <strong>${taskTitle}</strong> is due ${dueText}.</p>`
  });
}
