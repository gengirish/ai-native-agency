"use client"

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react"
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

function setTokenCookie(token: string) {
  document.cookie = `agencyos_token=${token};path=/;max-age=${60 * 60 * 24};SameSite=Lax`
}

function clearTokenCookie() {
  document.cookie = "agencyos_token=;path=/;max-age=0"
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("agencyos_token")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const token = localStorage.getItem("agencyos_token")
    if (!token) {
      setIsLoading(false)
      return
    }
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const json = (await res.json()) as { user?: User }
          if (json.user) {
            setUser(json.user)
            return
          }
        }
        localStorage.removeItem("agencyos_token")
        clearTokenCookie()
      })
      .catch(() => {
        localStorage.removeItem("agencyos_token")
        clearTokenCookie()
      })
      .finally(() => setIsLoading(false))

    const interval = setInterval(async () => {
      const t = localStorage.getItem("agencyos_token")
      if (!t) return
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${t}` },
        })
        if (!res.ok) {
          localStorage.removeItem("agencyos_token")
          clearTokenCookie()
          setUser(null)
        }
      } catch {
        /* network error, skip */
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string }
        return { success: false, error: err.error ?? "Invalid email or password" }
      }
      const data = (await res.json()) as { user: User; token: string }
      localStorage.setItem("agencyos_token", data.token)
      setTokenCookie(data.token)
      setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, error: "Network error" }
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      if (!name || !email || !password) {
        return { success: false, error: "All fields are required" }
      }
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        })
        if (!res.ok) {
          const err = (await res.json().catch(() => ({}))) as { error?: string }
          return { success: false, error: err.error ?? "Registration failed" }
        }
        const data = (await res.json()) as { user: User; token: string }
        localStorage.setItem("agencyos_token", data.token)
        setTokenCookie(data.token)
        setUser(data.user)
        return { success: true }
      } catch {
        return { success: false, error: "Network error" }
      }
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("agencyos_token")
    clearTokenCookie()
    setUser(null)
    window.location.href = "/login"
  }, [])

  const can = useCallback(
    (permission: Permission) => {
      if (!user) return false
      return hasPermission(user.role, permission)
    },
    [user],
  )

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, can }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
