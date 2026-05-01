export type Role = 'USER' | 'MANAGER' | 'ADMIN';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  created_by: string;
  assigned_to?: string | null;
  due_at?: string | null;
  reminder_at?: string | null;
  reminder_sent: boolean;
  priority: Priority;
  status: Status;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  created_by_name?: string;
  assigned_to_name?: string;
  assigned_to_email?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  read_at?: string | null;
  created_at: string;
  task_title?: string;
};
