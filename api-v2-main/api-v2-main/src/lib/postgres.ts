import { Pool } from 'pg'

const connectionString =
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL

if (!connectionString) {
  throw new Error('Missing database connection string for pg (SUPABASE_DB_URL / DATABASE_URL)')
}

export const pgPool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
})