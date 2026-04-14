"use client"

import { createContext, useContext, useCallback, type ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import type { User, UserRole } from "@/types"
import { hasPermission, type Permission } from "./permissions"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  can: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated" && !!session?.user

  const user: User | null = isAuthenticated
    ? {
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.role ?? "admin",
        tenantId: session.user.tenantId ?? "",
        createdAt: new Date().toISOString(),
      }
    : null

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: "Invalid email or password" }
    }

    return { success: true }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" }
    }

    const result = await signIn("credentials", {
      email,
      password,
      name,
      role,
      action: "register",
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: "An account with this email already exists" }
    }

    return { success: true }
  }, [])

  const logout = useCallback(() => {
    signOut({ callbackUrl: "/login" })
  }, [])

  const can = useCallback(
    (permission: Permission) => {
      if (!user) return false
      return hasPermission(user.role, permission)
    },
    [user]
  )

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
