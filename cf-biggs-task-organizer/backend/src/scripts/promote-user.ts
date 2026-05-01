import dotenv from 'dotenv';
import { query, pool } from '../db.js';

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Usage: npm run db:promote -- user@example.com');
  process.exit(1);
}

try {
  const result = await query(
    `UPDATE users SET role = 'MANAGER', updated_at = NOW() WHERE email = $1 RETURNING id, name, email, role`,
    [email.toLowerCase()]
  );

  if (!result.rows[0]) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  console.log('Promoted user:', result.rows[0]);
} finally {
  await pool.end();
}
