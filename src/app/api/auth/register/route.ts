import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth/jwt"
import { createUser, findUserByEmail } from "@/lib/dal"
import { getDb, hasDb } from "@/lib/db"
import type { UserRole } from "@/types"

const ROLES: UserRole[] = ["admin", "expert", "client"]

function isUserRole(v: unknown): v is UserRole {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v)
}

async function resolveDefaultTenantId(): Promise<string> {
  if (!hasDb()) return "t_demo"
  const sql = getDb()!
  const rows = await sql`
    INSERT INTO tenants (name, slug, plan)
    VALUES ('Self-serve', 'self-serve-default', 'starter')
    ON CONFLICT (slug) DO UPDATE SET updated_at = now()
    RETURNING id
  `
  const id = rows[0]?.id
  if (id === undefined) {
    throw new Error("Failed to resolve default tenant")
  }
  return String(id)
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

  const existing = await findUserByEmail(normalizedEmail)
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  const passwordHash = bcrypt.hashSync(password, 10)
  const tenantId = await resolveDefaultTenantId()

  const row = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    role,
    tenantId,
    passwordHash,
  })

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
