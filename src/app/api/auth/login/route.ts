import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { signToken, userWithoutPassword } from "@/lib/auth/jwt"
import { store } from "@/lib/store"

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
  const user = store.users.find((u) => u.email.toLowerCase() === normalizedEmail)

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const token = await signToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  })

  return NextResponse.json({
    user: userWithoutPassword(user),
    token,
  })
}
