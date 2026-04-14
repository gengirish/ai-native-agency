import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth config (no Node.js dependencies).
 * Used by middleware for JWT verification only.
 * The full config with credentials + bcrypt lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).tenantId = token.tenantId
      }
      return session
    },
  },
}
