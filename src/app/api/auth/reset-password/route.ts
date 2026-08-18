import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { updateUserPassword } from "@/lib/dal"
import {
  consumeResetToken,
  inspectResetToken,
  invalidateTokensForUser,
} from "@/lib/auth/password-reset"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 200

function messageForReason(reason: "not_found" | "expired" | "used"): string {
  switch (reason) {
    case "expired":
      return "This reset link has expired. Request a new one."
    case "used":
      return "This reset link has already been used. Request a new one."
    default:
      return "This reset link is invalid. Request a new one."
  }
}

/** Lets the reset page decide whether to render the form or an expired notice. */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (!rateLimit(`reset:inspect:${ip}`, 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 })
  }

  const token = request.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ valid: false, reason: "not_found" }, { status: 400 })
  }

  try {
    const result = await inspectResetToken(token)
    if (!result.ok) {
      return NextResponse.json({
        valid: false,
        reason: result.reason,
        error: messageForReason(result.reason),
      })
    }
    return NextResponse.json({ valid: true })
  } catch (err) {
    console.error("[API] GET /api/auth/reset-password:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // 10 attempts / 15 min per IP — the only thing standing between an attacker
  // and brute-forcing token guesses.
  if (!rateLimit(`reset:${ip}`, 10, 15 * 60_000)) {
    return NextResponse.json(
      { error: "Too many reset attempts. Try again later." },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { token, password } = body as Record<string, unknown>

  if (typeof token !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Missing fields: token, password" },
      { status: 400 },
    )
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 },
    )
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return NextResponse.json({ error: "Password is too long" }, { status: 400 })
  }

  try {
    const consumed = await consumeResetToken(token)
    if (!consumed.ok) {
      return NextResponse.json(
        { error: messageForReason(consumed.reason), reason: consumed.reason },
        { status: 400 },
      )
    }

    const passwordHash = bcrypt.hashSync(password, 10)
    const updated = await updateUserPassword(consumed.userId, passwordHash)
    if (!updated) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    // Burn any other outstanding links for this account.
    await invalidateTokensForUser(consumed.userId)

    return NextResponse.json({
      message: "Password reset. You can now sign in with your new password.",
    })
  } catch (err) {
    console.error("[API] POST /api/auth/reset-password:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
