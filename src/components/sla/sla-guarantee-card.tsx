"use client"

import { ShieldCheck, ArrowRight } from "lucide-react"

export function SLAGuaranteeCard() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-8 text-white shadow-lg ring-1 ring-purple-500/30">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-purple-100 ring-1 ring-white/20">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              SLA guarantee
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              We guarantee delivery times that no traditional agency can match
            </h2>
            <p className="text-purple-100/90">
              If we miss our SLA, you get automatic credits — contractually enforced, not a handshake promise.
            </p>
            <p className="text-lg font-medium text-white">
              4-hour first draft — or your money back
              <span className="ml-2 text-sm font-normal text-purple-200">(Enterprise tier)</span>
            </p>
          </div>

          <div className="w-full max-w-md shrink-0 space-y-3 rounded-xl bg-black/25 p-5 ring-1 ring-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-300">Traditional agency</span>
              <span className="rounded-md bg-slate-600/80 px-2 py-1 text-xs font-medium text-slate-100">
                2–5 business days
              </span>
            </div>
            <div className="flex justify-center py-1">
              <ArrowRight className="h-5 w-5 rotate-90 text-purple-300 lg:rotate-0" />
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-white">AgencyOS Enterprise</span>
              <span className="rounded-md bg-purple-500 px-2 py-1 text-xs font-bold text-white">4 hours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
