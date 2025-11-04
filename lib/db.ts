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

let _sql: ReturnType<typeof neon> | null = null

function getSql() {
  if (!_sql) {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL or POSTGRES_URL environment variable is not set. Please configure your Neon database connection.",
      )
    }

    _sql = neon(databaseUrl, {
      fetchOptions: {
        cache: "no-store",
      },
    })
  }
  return _sql
}

export const sql = new Proxy((() => {}) as unknown as ReturnType<typeof neon>, {
  apply(target, thisArg, args) {
    const realSql = getSql()
    return realSql.apply(thisArg, args as any)
  },
  get(target, prop) {
    const realSql = getSql()
    return realSql[prop as keyof ReturnType<typeof neon>]
  },
})
