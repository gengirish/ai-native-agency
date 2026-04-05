"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  FilePlus,
  CheckCircle,
  Palette,
  ClipboardCheck,
  MessageCircle,
  CreditCard,
  Users,
  BarChart3,
  Bot,
  TrendingUp,
  Cpu,
  Lightbulb,
  Send,
  Trophy,
  Shield,
  Zap,
} from "lucide-react"

const navigation = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "PROJECTS",
    items: [
      { name: "All Projects", href: "/projects", icon: FolderOpen },
      { name: "New Brief", href: "/projects/new", icon: FilePlus },
      { name: "Review Hub", href: "/review", icon: CheckCircle },
    ],
  },
  {
    section: "BRAND",
    items: [
      { name: "Brand DNA", href: "/brand", icon: Palette },
    ],
  },
  {
    section: "EXPERT",
    items: [
      { name: "Expert Queue", href: "/expert", icon: ClipboardCheck },
      { name: "Feedback Copilot", href: "/feedback", icon: MessageCircle },
    ],
  },
  {
    section: "BUSINESS",
    items: [
      { name: "Billing", href: "/billing", icon: CreditCard },
      { name: "CRM & Sales", href: "/crm", icon: Users },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    section: "AI ENGINE",
    items: [
      { name: "Autonomy Engine", href: "/autonomy", icon: Bot },
      { name: "Performance", href: "/performance", icon: TrendingUp },
      { name: "AI Gateway", href: "/ai-engine", icon: Cpu },
    ],
  },
  {
    section: "OPERATIONS",
    items: [
      { name: "Creative Director", href: "/proactive", icon: Lightbulb },
      { name: "Auto-Publish", href: "/publishing", icon: Send },
      { name: "Benchmarks", href: "/benchmarks", icon: Trophy },
      { name: "SLA Management", href: "/sla", icon: Shield },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col bg-slate-950 text-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800/60 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">AgencyOS</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            AI-Native Platform
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
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
                      {isActive && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      )}
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
            AR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">Alex Rivera</p>
            <p className="text-[11px] text-slate-500">Agency Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
