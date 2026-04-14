import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { UserRole } from "@/types"
import { authConfig } from "./auth.config"
import { getDb } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase()
        const password = credentials?.password as string | undefined
        const action = credentials?.action as string | undefined

        if (!email || !password) return null

        const sql = getDb()

        if (action === "register") {
          const name = credentials?.name as string | undefined
          const role = (credentials?.role as UserRole) || "admin"
          if (!name?.trim()) return null

          const existing = await sql`SELECT id FROM users WHERE email = ${email}`
          if (existing.length > 0) return null

          const passwordHash = bcrypt.hashSync(password, 10)

          const rows = await sql`
            INSERT INTO users (email, name, role, password_hash)
            VALUES (${email}, ${name.trim()}, ${role}, ${passwordHash})
            RETURNING id, email, name, role, tenant_id
          `
          const u = rows[0]
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role as UserRole,
            tenantId: u.tenant_id ?? "",
          }
        }

        const rows = await sql`
          SELECT id, email, name, role, tenant_id, password_hash
          FROM users WHERE email = ${email}
        `
        if (rows.length === 0) return null

        const u = rows[0]
        if (!u.password_hash) return null

        const valid = bcrypt.compareSync(password, u.password_hash)
        if (!valid) return null

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          tenantId: u.tenant_id ?? "",
        }
      },
    }),
  ],
})
