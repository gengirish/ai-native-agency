"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/context"
import { hasPermission, type Permission } from "@/lib/auth/permissions"
import {
  LayoutDashboard, FolderOpen, FilePlus, CheckCircle, Palette,
  ClipboardCheck, MessageCircle, CreditCard, Users, BarChart3,
  Bot, TrendingUp, Cpu, Lightbulb, Send, Trophy, Shield, Zap, LogOut,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  permission: Permission
}

interface NavSection {
  section: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:view" },
    ],
  },
  {
    section: "PROJECTS",
    items: [
      { name: "All Projects", href: "/projects", icon: FolderOpen, permission: "projects:view" },
      { name: "New Brief", href: "/projects/new", icon: FilePlus, permission: "projects:create" },
      { name: "Review Hub", href: "/review", icon: CheckCircle, permission: "review:view" },
    ],
  },
  {
    section: "BRAND",
    items: [
      { name: "Brand DNA", href: "/brand", icon: Palette, permission: "brand:view" },
    ],
  },
  {
    section: "EXPERT",
    items: [
      { name: "Expert Queue", href: "/expert", icon: ClipboardCheck, permission: "expert:view" },
      { name: "Feedback Copilot", href: "/feedback", icon: MessageCircle, permission: "feedback:view" },
    ],
  },
  {
    section: "BUSINESS",
    items: [
      { name: "Billing", href: "/billing", icon: CreditCard, permission: "billing:view" },
      { name: "CRM & Sales", href: "/crm", icon: Users, permission: "crm:view" },
      { name: "Analytics", href: "/analytics", icon: BarChart3, permission: "analytics:view" },
    ],
  },
  {
    section: "AI ENGINE",
    items: [
      { name: "Autonomy Engine", href: "/autonomy", icon: Bot, permission: "autonomy:view" },
      { name: "Performance", href: "/performance", icon: TrendingUp, permission: "performance:view" },
      { name: "AI Gateway", href: "/ai-engine", icon: Cpu, permission: "ai-engine:view" },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { name: "Creative Director", href: "/proactive", icon: Lightbulb, permission: "proactive:view" },
      { name: "Auto-Publish", href: "/publishing", icon: Send, permission: "publishing:view" },
      { name: "Benchmarks", href: "/benchmarks", icon: Trophy, permission: "benchmarks:view" },
      { name: "SLA Management", href: "/sla", icon: Shield, permission: "sla:view" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  if (!user) return null

  const visibleSections = navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(user.role, item.permission)),
    }))
    .filter((group) => group.items.length > 0)

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const roleLabel =
    user.role === "admin" ? "Agency Admin" : user.role === "expert" ? "Expert" : "Client"

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col bg-slate-950 text-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800/60 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">AgencyOS</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">AI-Native Platform</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleSections.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                        isActive
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0",
                          isActive ? "text-indigo-400" : "text-slate-500"
                        )}
                      />
                      {item.name}
                      {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">{user.name}</p>
            <p className="text-[11px] text-slate-500">{roleLabel}</p>
          </div>
          <button
            onClick={() => { logout(); router.replace("/login") }}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
