import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  dueAt: z.string().datetime().optional().nullable(),
  reminderAt: z.string().datetime().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  status: z.enum(['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED']).default('TODO')
});

export const commentSchema = z.object({
  body: z.string().min(1)
});
