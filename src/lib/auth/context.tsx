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

const TOKEN_KEY = "agencyos_token"
const STORAGE_KEY = "agencyos_auth"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function setAuthStorage(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(STORAGE_KEY)
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: unknown }
    if (typeof data.error === "string") return data.error
  } catch {
    // ignore
  }
  return res.statusText || "Request failed"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      try {
        const token = localStorage.getItem(TOKEN_KEY)

        if (token) {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (cancelled) return

          if (res.ok) {
            const data = (await res.json()) as { user: User }
            setState({ user: data.user, isAuthenticated: true, isLoading: false })
            return
          }

          if (res.status === 401) {
            clearAuthStorage()
            setState({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          setState({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const user = JSON.parse(stored) as User
          if (!cancelled) {
            setState({ user, isAuthenticated: true, isLoading: false })
          }
          return
        }

        if (!cancelled) setState((s) => ({ ...s, isLoading: false }))
      } catch {
        if (!cancelled) setState((s) => ({ ...s, isLoading: false }))
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await readErrorMessage(res)
      return { success: false, error }
    }

    const data = (await res.json()) as { user: User; token: string }
    setAuthStorage(data.token, data.user)
    setState({ user: data.user, isAuthenticated: true, isLoading: false })
    return { success: true }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" }
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (!res.ok) {
      const error = await readErrorMessage(res)
      return { success: false, error }
    }

    const data = (await res.json()) as { user: User; token: string }
    setAuthStorage(data.token, data.user)
    setState({ user: data.user, isAuthenticated: true, isLoading: false })
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    clearAuthStorage()
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  const can = useCallback(
    (permission: Permission) => {
      if (!state.user) return false
      return hasPermission(state.user.role, permission)
    },
    [state.user],
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
