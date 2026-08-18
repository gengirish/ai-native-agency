/**
 * Password reset tokens — dual mode, mirroring the DAL.
 *
 * When DATABASE_URL is set  → password_reset_tokens table.
 * When DATABASE_URL is unset → in-memory map (demo mode).
 *
 * Only the SHA-256 hash of a token is ever persisted. The raw token exists in
 * the emailed link and nowhere else.
 */

import { createHash, randomBytes, timingSafeEqual } from "crypto"
import { getDb, hasDb } from "@/lib/db"
import { store } from "@/lib/store"

const TOKEN_BYTES = 32
const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

export const PASSWORD_RESET_TTL_MINUTES = TOKEN_TTL_MS / 60_000

export interface IssuedToken {
  rawToken: string
  tokenHash: string
  expiresAt: Date
}

export type ConsumedToken =
  | { ok: true; userId: string }
  | { ok: false; reason: "not_found" | "expired" | "used" }

interface MemoryToken {
  userId: string
  tokenHash: string
  expiresAt: number
  usedAt: number | null
  requestIp?: string
}

const g = globalThis as unknown as { __agencyos_reset_tokens?: MemoryToken[] }
if (!g.__agencyos_reset_tokens) {
  g.__agencyos_reset_tokens = []
}
const memoryTokens = g.__agencyos_reset_tokens

/** SHA-256 of the raw token. Lookup is by exact hash, so no reversal is possible. */
export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex")
}

export function generateResetToken(): IssuedToken {
  const rawToken = randomBytes(TOKEN_BYTES).toString("base64url")
  return {
    rawToken,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  }
}

/**
 * Issue a fresh token, invalidating any prior unused tokens for the same user
 * so only the most recent reset link works.
 */
export async function issueResetTokenForUser(params: {
  userId: string
  requestIp?: string
}): Promise<IssuedToken> {
  const token = generateResetToken()

  if (hasDb()) {
    const sql = getDb()!
    await sql`
      UPDATE password_reset_tokens
      SET used_at = now()
      WHERE user_id = ${params.userId} AND used_at IS NULL
    `
    await sql`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, request_ip)
      VALUES (${params.userId}, ${token.tokenHash}, ${token.expiresAt.toISOString()}, ${params.requestIp ?? null})
    `
    return token
  }

  const now = Date.now()
  for (const t of memoryTokens) {
    if (t.userId === params.userId && t.usedAt === null) t.usedAt = now
  }
  memoryTokens.push({
    userId: params.userId,
    tokenHash: token.tokenHash,
    expiresAt: token.expiresAt.getTime(),
    usedAt: null,
    requestIp: params.requestIp,
  })
  return token
}

/** Read-only validity check — used by the reset page before rendering the form. */
export async function inspectResetToken(rawToken: string): Promise<ConsumedToken> {
  const tokenHash = hashToken(rawToken)

  if (hasDb()) {
    const sql = getDb()!
    const rows = await sql`
      SELECT user_id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token_hash = ${tokenHash}
      LIMIT 1
    `
    const row = rows[0]
    if (!row) return { ok: false, reason: "not_found" }
    if (row.used_at) return { ok: false, reason: "used" }
    if (new Date(String(row.expires_at)).getTime() < Date.now()) {
      return { ok: false, reason: "expired" }
    }
    return { ok: true, userId: String(row.user_id) }
  }

  const record = findMemoryToken(tokenHash)
  if (!record) return { ok: false, reason: "not_found" }
  if (record.usedAt !== null) return { ok: false, reason: "used" }
  if (record.expiresAt < Date.now()) return { ok: false, reason: "expired" }
  return { ok: true, userId: record.userId }
}

/**
 * Validate and burn a token in one step. Single-use: the `used_at IS NULL`
 * guard in the UPDATE makes a concurrent double-consume return "used" for the
 * loser rather than resetting the password twice.
 */
export async function consumeResetToken(rawToken: string): Promise<ConsumedToken> {
  const tokenHash = hashToken(rawToken)

  if (hasDb()) {
    const sql = getDb()!
    const claimed = await sql`
      UPDATE password_reset_tokens
      SET used_at = now()
      WHERE token_hash = ${tokenHash}
        AND used_at IS NULL
        AND expires_at > now()
      RETURNING user_id
    `
    if (claimed[0]) return { ok: true, userId: String(claimed[0].user_id) }

    // Nothing claimed — say precisely why so the UI can offer the right recovery.
    const rows = await sql`
      SELECT expires_at, used_at FROM password_reset_tokens
      WHERE token_hash = ${tokenHash} LIMIT 1
    `
    const row = rows[0]
    if (!row) return { ok: false, reason: "not_found" }
    if (row.used_at) return { ok: false, reason: "used" }
    return { ok: false, reason: "expired" }
  }

  const record = findMemoryToken(tokenHash)
  if (!record) return { ok: false, reason: "not_found" }
  if (record.usedAt !== null) return { ok: false, reason: "used" }
  if (record.expiresAt < Date.now()) return { ok: false, reason: "expired" }
  record.usedAt = Date.now()
  return { ok: true, userId: record.userId }
}

/** Invalidate every outstanding token for a user (called after a successful reset). */
export async function invalidateTokensForUser(userId: string): Promise<void> {
  if (hasDb()) {
    const sql = getDb()!
    await sql`
      UPDATE password_reset_tokens SET used_at = now()
      WHERE user_id = ${userId} AND used_at IS NULL
    `
    return
  }
  const now = Date.now()
  for (const t of memoryTokens) {
    if (t.userId === userId && t.usedAt === null) t.usedAt = now
  }
}

/**
 * Constant-time hash comparison for the in-memory path. Postgres lookups are
 * indexed by exact hash so they don't leak a useful timing signal; the JS
 * scan would, without this.
 */
function findMemoryToken(tokenHash: string): MemoryToken | undefined {
  const needle = Buffer.from(tokenHash, "hex")
  let found: MemoryToken | undefined
  for (const t of memoryTokens) {
    const candidate = Buffer.from(t.tokenHash, "hex")
    if (candidate.length === needle.length && timingSafeEqual(candidate, needle)) {
      found = t
    }
  }
  return found
}

/** Demo-mode helper: the in-memory store keys users by id. */
export function memoryUserExists(userId: string): boolean {
  return store.users.some((u) => u.id === userId)
}
