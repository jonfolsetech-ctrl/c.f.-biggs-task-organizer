import { Router } from 'express';
import { query } from '../db.js';
import { loginSchema, registerSchema } from '../validators/auth.schema.js';
import { comparePassword, hashPassword, signToken } from '../services/auth.service.js';
import { authRequired } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten() });

  const { name, email, password } = parsed.data;
  const passwordHash = await hashPassword(password);

  try {
    const existingUsers = await query(`SELECT COUNT(*)::int AS count FROM users`);
    const role = existingUsers.rows[0].count === 0 ? 'ADMIN' : 'USER';

    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase(), passwordHash, role]
    );

    const user = result.rows[0];
    const token = signToken(user);
    return res.status(201).json({ user, token });
  } catch (error: any) {
    if (error.code === '23505') return res.status(409).json({ message: 'Email already exists' });
    return res.status(500).json({ message: 'Registration failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid input' });

  const result = await query(
    `SELECT id, name, email, password_hash, role FROM users WHERE email = $1`,
    [parsed.data.email.toLowerCase()]
  );

  const user = result.rows[0];
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const valid = await comparePassword(parsed.data.password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = signToken(safeUser);
  return res.json({ user: safeUser, token });
});

authRouter.get('/me', authRequired, async (req, res) => {
  return res.json({ user: req.user });
});
