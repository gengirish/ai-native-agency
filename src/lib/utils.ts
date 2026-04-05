import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date("2026-04-05T12:00:00Z")
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return formatDate(date)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    submitted: "bg-blue-100 text-blue-700",
    ai_generating: "bg-purple-100 text-purple-700",
    qa_check: "bg-yellow-100 text-yellow-700",
    expert_review: "bg-orange-100 text-orange-700",
    client_review: "bg-cyan-100 text-cyan-700",
    revision: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    delivered: "bg-emerald-100 text-emerald-700",
    pending: "bg-slate-100 text-slate-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    running: "bg-blue-100 text-blue-700",
    live: "bg-green-100 text-green-700",
    paused: "bg-yellow-100 text-yellow-700",
    new: "bg-blue-100 text-blue-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    on_track: "bg-green-100 text-green-700",
    at_risk: "bg-yellow-100 text-yellow-700",
    breached: "bg-red-100 text-red-700",
  }
  return colors[status] || "bg-slate-100 text-slate-700"
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  }
  return colors[priority] || "bg-slate-100 text-slate-600"
}
