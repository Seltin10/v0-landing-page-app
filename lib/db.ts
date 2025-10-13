import { neon } from "@neondatabase/serverless"

/**
 * Database connection using Neon serverless driver
 *
 * This module provides a configured SQL client for interacting with the PostgreSQL database.
 * The connection uses the DATABASE_URL environment variable which should be set in .env.local
 *
 * @example
 * ```typescript
 * import { sql } from '@/lib/db'
 *
 * const users = await sql`SELECT * FROM users WHERE email = ${email}`
 * ```
 *
 * @see https://neon.tech/docs/serverless/serverless-driver
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Please configure your Neon database connection.")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }
