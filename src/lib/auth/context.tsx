"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
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

const STORAGE_KEY = "agencyos_auth"

function generateUserId(): string {
  return "u_" + Math.random().toString(36).substring(2, 10)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const user = JSON.parse(stored) as User
        setState({ user, isAuthenticated: true, isLoading: false })
      } else {
        setState((s) => ({ ...s, isLoading: false }))
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const usersRaw = localStorage.getItem("agencyos_users")
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : []
    const found = users.find((u) => u.email === email)

    if (!found) {
      return { success: false, error: "Invalid email or password" }
    }

    const passMap: Record<string, string> = JSON.parse(localStorage.getItem("agencyos_passwords") || "{}")
    if (passMap[email] !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setState({ user: found, isAuthenticated: true, isLoading: false })
    return { success: true }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" }
    }

    const usersRaw = localStorage.getItem("agencyos_users")
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : []

    if (users.some((u) => u.email === email)) {
      return { success: false, error: "An account with this email already exists" }
    }

    const newUser: User = {
      id: generateUserId(),
      name,
      email,
      role,
      tenantId: "t_" + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("agencyos_users", JSON.stringify(users))

    const passMap: Record<string, string> = JSON.parse(localStorage.getItem("agencyos_passwords") || "{}")
    passMap[email] = password
    localStorage.setItem("agencyos_passwords", JSON.stringify(passMap))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setState({ user: newUser, isAuthenticated: true, isLoading: false })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  const can = useCallback(
    (permission: Permission) => {
      if (!state.user) return false
      return hasPermission(state.user.role, permission)
    },
    [state.user]
  )

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
