import type { Pipeline } from "@/types"
import { PipelineCard } from "./pipeline-card"

export function ActivePipelines({ pipelines }: { pipelines: Pipeline[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Active Pipelines</h2>
        <p className="text-sm text-slate-500">Live routing, task status, and spend per step</p>
      </div>
      <div className="flex flex-col gap-6">
        {pipelines.map((p) => (
          <PipelineCard key={p.id} pipeline={p} />
        ))}
      </div>
    </section>
  )
}
