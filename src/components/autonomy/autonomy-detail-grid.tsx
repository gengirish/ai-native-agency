"use client"

import type { AutonomyConfig } from "@/types"
import { AutonomyDetailCard } from "./autonomy-detail-card"

type AutonomyDetailGridProps = {
  configs: AutonomyConfig[]
}

export function AutonomyDetailGrid({ configs }: AutonomyDetailGridProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Task type details</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {configs.map((c) => (
          <AutonomyDetailCard key={c.id} config={c} />
        ))}
      </div>
    </section>
  )
}
