"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { Sidebar } from "./sidebar"
import { useEffect } from "react"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const isLoginPage = pathname === "/login"
  const isLandingPage = pathname === "/"

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage && !isLandingPage) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, isLoginPage, isLandingPage, router])

  if (isLoginPage || isLandingPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div role="status" aria-label="Loading">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  )
}
