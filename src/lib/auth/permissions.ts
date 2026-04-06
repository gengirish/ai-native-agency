import type { UserRole } from "@/types"

export type Permission =
  | "dashboard:view"
  | "projects:view"
  | "projects:create"
  | "projects:manage"
  | "review:view"
  | "review:manage"
  | "brand:view"
  | "brand:manage"
  | "expert:view"
  | "expert:manage"
  | "feedback:view"
  | "billing:view"
  | "billing:manage"
  | "crm:view"
  | "crm:manage"
  | "analytics:view"
  | "autonomy:view"
  | "autonomy:manage"
  | "performance:view"
  | "ai-engine:view"
  | "ai-engine:manage"
  | "proactive:view"
  | "publishing:view"
  | "publishing:manage"
  | "benchmarks:view"
  | "sla:view"
  | "sla:manage"
  | "settings:view"
  | "settings:manage"

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "dashboard:view",
    "projects:view", "projects:create", "projects:manage",
    "review:view", "review:manage",
    "brand:view", "brand:manage",
    "expert:view", "expert:manage",
    "feedback:view",
    "billing:view", "billing:manage",
    "crm:view", "crm:manage",
    "analytics:view",
    "autonomy:view", "autonomy:manage",
    "performance:view",
    "ai-engine:view", "ai-engine:manage",
    "proactive:view",
    "publishing:view", "publishing:manage",
    "benchmarks:view",
    "sla:view", "sla:manage",
    "settings:view", "settings:manage",
  ],
  expert: [
    "dashboard:view",
    "projects:view",
    "review:view", "review:manage",
    "brand:view",
    "expert:view", "expert:manage",
    "feedback:view",
    "performance:view",
  ],
  client: [
    "dashboard:view",
    "projects:view", "projects:create",
    "brand:view",
    "feedback:view",
    "billing:view",
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export interface RouteConfig {
  path: string
  permission: Permission
  label: string
}

export const ROUTE_PERMISSIONS: RouteConfig[] = [
  { path: "/dashboard", permission: "dashboard:view", label: "Dashboard" },
  { path: "/projects", permission: "projects:view", label: "Projects" },
  { path: "/projects/new", permission: "projects:create", label: "New Brief" },
  { path: "/review", permission: "review:view", label: "Review Hub" },
  { path: "/brand", permission: "brand:view", label: "Brand DNA" },
  { path: "/expert", permission: "expert:view", label: "Expert Queue" },
  { path: "/feedback", permission: "feedback:view", label: "Feedback Copilot" },
  { path: "/billing", permission: "billing:view", label: "Billing" },
  { path: "/crm", permission: "crm:view", label: "CRM & Sales" },
  { path: "/analytics", permission: "analytics:view", label: "Analytics" },
  { path: "/autonomy", permission: "autonomy:view", label: "Autonomy Engine" },
  { path: "/performance", permission: "performance:view", label: "Performance" },
  { path: "/ai-engine", permission: "ai-engine:view", label: "AI Gateway" },
  { path: "/proactive", permission: "proactive:view", label: "Creative Director" },
  { path: "/publishing", permission: "publishing:view", label: "Auto-Publish" },
  { path: "/benchmarks", permission: "benchmarks:view", label: "Benchmarks" },
  { path: "/sla", permission: "sla:view", label: "SLA Management" },
]

export function canAccessRoute(role: UserRole, path: string): boolean {
  const route = ROUTE_PERMISSIONS.find(
    (r) => path === r.path || (r.path !== "/dashboard" && path.startsWith(r.path + "/"))
  )
  if (!route) return true
  return hasPermission(role, route.permission)
}
