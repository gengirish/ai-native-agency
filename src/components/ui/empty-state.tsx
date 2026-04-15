import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import Link from "next/link"

interface Props {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; href: string }
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <Icon className="mb-4 h-10 w-10 text-slate-300" aria-hidden />
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
