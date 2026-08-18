import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { findUserByEmail } from "@/lib/dal"
import { issueResetTokenForUser } from "@/lib/auth/password-reset"
import { sendPasswordResetEmail } from "@/lib/email/password-reset-email"
import { getClientIp, rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Identical response whether or not the address is registered — otherwise this
// endpoint becomes an account-enumeration oracle.
const GENERIC_SUCCESS = {
  message:
    "If an account exists for that email, we've sent password reset instructions. Check your inbox and spam folder.",
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  // Per-IP: 5 requests/hour. Blunts bulk enumeration and mailbombing.
  if (!rateLimit(`forgot:${ip}`, 5, 60 * 60_000)) {
    return NextResponse.json(
      { error: "Too many reset requests from this address. Try again in an hour." },
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

  const { email } = body as Record<string, unknown>
  if (typeof email !== "string") {
    return NextResponse.json({ error: "Missing field: email" }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(normalizedEmail) || normalizedEmail.length > 254) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
  }

  // Per-email: 1 request/minute, so nobody can flood a real user's inbox.
  // Still answers with the generic success — the throttle must not reveal
  // that the address is real.
  if (!rateLimit(`forgot:email:${normalizedEmail}`, 1, 60_000)) {
    return NextResponse.json(GENERIC_SUCCESS)
  }

  try {
    const user = await findUserByEmail(normalizedEmail)

    if (!user) {
      // Small random delay so the lookup-only path isn't obviously faster than
      // the lookup + token + send path. Raises the noise floor; not a complete
      // timing-side-channel defence.
      await new Promise((r) => setTimeout(r, 50 + Math.random() * 100))
      return NextResponse.json(GENERIC_SUCCESS)
    }

    const token = await issueResetTokenForUser({ userId: user.id, requestIp: ip })

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      rawToken: token.rawToken,
      requestOrigin: request.nextUrl.origin,
    })

    return NextResponse.json(GENERIC_SUCCESS)
  } catch (err) {
    console.error("[API] POST /api/auth/forgot-password:", err)
    // Still generic: an internal failure must not leak which emails exist.
    return NextResponse.json(GENERIC_SUCCESS)
  }
}
