"use client"

import { useAuth } from "@/lib/auth/context"
import type { Permission } from "@/lib/auth/permissions"
import { ShieldAlert } from "lucide-react"
import type { ReactNode } from "react"

interface Props {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

function DefaultFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldAlert className="mb-4 h-12 w-12 text-slate-300" />
      <h2 className="text-lg font-semibold text-slate-700">Access Restricted</h2>
      <p className="mt-1 text-sm text-slate-500">
        You don&apos;t have permission to view this section.
      </p>
    </div>
  )
}

export function RequireRole({ permission, children, fallback }: Props) {
  const { can, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  if (!can(permission)) {
    return <>{fallback ?? <DefaultFallback />}</>
  }

  return <>{children}</>
}
