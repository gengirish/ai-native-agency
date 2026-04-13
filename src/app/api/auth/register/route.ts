import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { signToken } from "@/lib/auth/jwt"
import { store, uid } from "@/lib/store"
import type { UserRole } from "@/types"

const ROLES: UserRole[] = ["admin", "expert", "client"]

function isUserRole(v: unknown): v is UserRole {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v)
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

  const { name, email, password, role } = body as Record<string, unknown>

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !isUserRole(role)
  ) {
    return NextResponse.json(
      { error: "Missing or invalid fields: name, email, password, role" },
      { status: 400 },
    )
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail || !name.trim() || !password) {
    return NextResponse.json(
      { error: "Missing or invalid fields: name, email, password, role" },
      { status: 400 },
    )
  }

  const exists = store.users.some(
    (u) => u.email.toLowerCase() === normalizedEmail,
  )
  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  const id = uid("u")
  const tenantId = uid("t")
  const createdAt = new Date().toISOString()

  const row = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
    tenantId,
    createdAt,
  }

  store.users.push(row)

  const token = await signToken({
    sub: row.id,
    email: row.email,
    role: row.role,
    tenantId: row.tenantId,
  })

  return NextResponse.json(
    {
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        tenantId: row.tenantId,
        createdAt: row.createdAt,
      },
      token,
    },
    { status: 201 },
  )
}
