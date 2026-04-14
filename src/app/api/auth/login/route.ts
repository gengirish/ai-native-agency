import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth/jwt"
import { findUserByEmail } from "@/lib/dal"

function verifyPassword(plain: string, passwordHash: string | undefined): boolean {
  if (!passwordHash) return false
  if (passwordHash.startsWith("$2")) {
    return bcrypt.compareSync(plain, passwordHash)
  }
  return plain === passwordHash
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { email, password } = body as Record<string, unknown>

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Missing fields: email, password" },
      { status: 400 },
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await findUserByEmail(normalizedEmail)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const token = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  })

  const { passwordHash: _h, ...publicUser } = user

  return NextResponse.json({
    user: publicUser,
    token,
  })
}
