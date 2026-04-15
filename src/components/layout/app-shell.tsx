"use client"

import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { Sidebar } from "./sidebar"
import { useEffect, useRef, useState } from "react"
import { Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  const isLoginPage = pathname === "/login"
  const isLandingPage = pathname === "/"

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage && !isLandingPage) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, isLoginPage, isLandingPage, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!sidebarOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        setSidebarOpen(false)
      }
    }
    document.addEventListener("keydown", onEscape)
    return () => document.removeEventListener("keydown", onEscape)
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return
    const root = drawerRef.current
    if (!root) return

    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

    const getFocusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
        if (el.hasAttribute("disabled")) return false
        if (el.getAttribute("aria-hidden") === "true") return false
        if (el.tabIndex < 0) return false
        return true
      })

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusable = getFocusable()
    ;(focusable[0] ?? root).focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const nodes = getFocusable()
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    root.addEventListener("keydown", onKeyDown)
    return () => {
      root.removeEventListener("keydown", onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [sidebarOpen])

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

  const closeDrawer = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden h-full shrink-0 lg:flex">
        <Sidebar />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Zap className="h-5 w-5 text-white" aria-hidden />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">AgencyOS</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="cursor-pointer rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!sidebarOpen}
      >
        <div
          role="presentation"
          className={cn(
            "absolute inset-0 z-0 cursor-pointer bg-black/50 transition-opacity duration-300 ease-in-out",
            sidebarOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={closeDrawer}
          aria-hidden="true"
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          tabIndex={-1}
          className={cn(
            "absolute inset-y-0 left-0 z-10 flex w-72 max-w-[85vw] shadow-xl transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={closeDrawer}
            className="absolute right-2 top-2 z-20 cursor-pointer rounded-md bg-slate-950/90 p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
          <Sidebar onClose={closeDrawer} />
        </div>
      </div>
    </div>
  )
}
