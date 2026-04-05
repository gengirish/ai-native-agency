"use client"

import { SLACompliance } from "@/types"
import { cn, formatCurrency } from "@/lib/utils"
import { CheckCircle2, AlertTriangle, XCircle, Wallet } from "lucide-react"

type Props = {
  records: SLACompliance[]
}

export function SLAComplianceOverview({ records }: Props) {
  const onTrack = records.filter((r) => r.status === "on_track").length
  const atRisk = records.filter((r) => r.status === "at_risk").length
  const breached = records.filter((r) => r.status === "breached").length
  const creditsTotal = records.reduce((sum, r) => sum + r.creditIssued, 0)

  const cards = [
    {
      label: "On Track",
      value: onTrack,
      icon: CheckCircle2,
      className: "border-emerald-200 bg-white text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "At Risk",
      value: atRisk,
      icon: AlertTriangle,
      className: "border-amber-200 bg-white text-amber-800",
      iconBg: "bg-amber-100 text-amber-600",
    },
    {
      label: "Breached",
      value: breached,
      icon: XCircle,
      className: "border-rose-200 bg-white text-rose-700",
      iconBg: "bg-rose-100 text-rose-600",
    },
    {
      label: "Credits Issued",
      value: formatCurrency(creditsTotal),
      icon: Wallet,
      className: "border-slate-200 bg-white text-slate-900",
      iconBg: "bg-slate-100 text-slate-600",
      isText: true,
    },
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">SLA compliance overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={cn(
              "flex items-center gap-4 rounded-xl border p-5 shadow-sm",
              c.className,
            )}
          >
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", c.iconBg)}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{c.label}</p>
              <p className={cn("text-2xl font-semibold tracking-tight", c.isText ? "text-slate-900" : "")}>
                {c.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
