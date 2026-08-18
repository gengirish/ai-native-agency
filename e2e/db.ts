/**
 * Direct database access for E2E fixtures.
 *
 * Tests that need to observe or plant state the HTTP API deliberately does not
 * expose — password reset tokens, cross-tenant rows, cleanup of users a test
 * created — talk to Postgres here rather than adding test-only endpoints to the
 * app. Specs that use these helpers must skip themselves when there is no
 * DATABASE_URL, since the app also runs in an in-memory demo mode.
 */

import "dotenv/config"
import { createHash } from "crypto"
import { Client } from "pg"

export function hasDb(): boolean {
  return !!process.env.DATABASE_URL
}

async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  return withClient(async (client) => {
    const res = await client.query(text, params)
    return res.rows as T[]
  })
}

/* ------------------------------------------------------------------ */
/*  Users                                                             */
/* ------------------------------------------------------------------ */

export async function findUserIdByEmail(email: string): Promise<string | null> {
  const rows = await query<{ id: string }>("SELECT id FROM users WHERE email = $1", [email])
  return rows[0]?.id ?? null
}

/** Remove a user created by a test. Reset tokens cascade with the row. */
export async function deleteUserByEmail(email: string): Promise<void> {
  await query("DELETE FROM users WHERE email = $1", [email])
}

/* ------------------------------------------------------------------ */
/*  Password reset tokens                                             */
/* ------------------------------------------------------------------ */

/** Mirrors src/lib/auth/password-reset.ts — only the hash is ever stored. */
export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex")
}

/**
 * Plant a reset token whose raw value the test knows.
 *
 * The app only ever stores the SHA-256 hash and mails the raw token, so a test
 * cannot recover a real token without reading the mailbox. Planting one lets us
 * drive the actual reset UI end to end without depending on email delivery.
 */
export async function plantResetToken(
  userId: string,
  rawToken: string,
  options: { expiresInMs?: number; used?: boolean } = {},
): Promise<void> {
  const expiresAt = new Date(Date.now() + (options.expiresInMs ?? 60 * 60 * 1000))
  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used_at, request_ip)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      userId,
      hashToken(rawToken),
      expiresAt.toISOString(),
      options.used ? new Date().toISOString() : null,
      "e2e",
    ],
  )
}

export async function countResetTokens(userId: string): Promise<number> {
  const rows = await query<{ count: string }>(
    "SELECT count(*) AS count FROM password_reset_tokens WHERE user_id = $1",
    [userId],
  )
  return Number(rows[0]?.count ?? 0)
}

export async function countUnusedResetTokens(userId: string): Promise<number> {
  const rows = await query<{ count: string }>(
    "SELECT count(*) AS count FROM password_reset_tokens WHERE user_id = $1 AND used_at IS NULL",
    [userId],
  )
  return Number(rows[0]?.count ?? 0)
}

export async function deleteResetTokensForUser(userId: string): Promise<void> {
  await query("DELETE FROM password_reset_tokens WHERE user_id = $1", [userId])
}

/* ------------------------------------------------------------------ */
/*  Projects                                                          */
/* ------------------------------------------------------------------ */

export async function deleteProject(projectId: string): Promise<void> {
  await query("DELETE FROM projects WHERE id = $1", [projectId])
}

export async function findAnyProjectIdForTenantSlug(slug: string): Promise<string | null> {
  const rows = await query<{ id: string }>(
    `SELECT p.id FROM projects p
     JOIN tenants t ON t.id = p.tenant_id
     WHERE t.slug = $1
     LIMIT 1`,
    [slug],
  )
  return rows[0]?.id ?? null
}
