import type { UserRole } from "@/types"

declare module "next-auth" {
  interface User {
    role?: UserRole
    tenantId?: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      tenantId: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    tenantId: string
  }
}
