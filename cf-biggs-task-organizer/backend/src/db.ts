import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl
});

export async function query<T = any>(sql: string, params: unknown[] = []) {
  return pool.query<T>(sql, params);
}
