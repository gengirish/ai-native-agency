"use client"

import type { AITask, AITaskStatus, Pipeline } from "@/types"
import { cn, formatCurrencyPrecise, getStatusColor } from "@/lib/utils"
import {
  ArrowRight,
  Brain,
  FileSearch,
  Image as ImageIcon,
  MessageSquare,
  Palette,
  ShieldCheck,
  Video,
  Wand2,
} from "lucide-react"

function taskIcon(type: string) {
  const t = type.toLowerCase()
  if (t.includes("brief") || t.includes("analysis")) return FileSearch
  if (t.includes("copy") || t.includes("text")) return MessageSquare
  if (t.includes("image")) return ImageIcon
  if (t.includes("video")) return Video
  if (t.includes("design")) return Palette
  if (t.includes("qa") || t.includes("valid")) return ShieldCheck
  if (t.includes("strategy")) return Brain
  return Wand2
}

function formatLatency(ms: number): string {
  if (ms <= 0) return "—"
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

function taskStatusRing(status: AITaskStatus): string {
  switch (status) {
    case "queued":
    case "retrying":
      return "border-slate-200 bg-slate-50 text-slate-600 opacity-70"
    case "running":
      return "border-blue-300 bg-blue-50 text-blue-900 shadow-sm"
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-900"
    case "failed":
      return "border-red-300 bg-red-50 text-red-900"
    default:
      return "border-slate-200 bg-white text-slate-700"
  }
}

function TaskNode({ task }: { task: AITask }) {
  const Icon = taskIcon(task.type)
  const running = task.status === "running"

  return (
    <div
      className={cn(
        "relative flex min-w-[140px] max-w-[160px] flex-col rounded-xl border-2 p-3 transition-colors",
        taskStatusRing(task.status),
        running && "animate-pulse"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-1">
        <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            task.status === "queued" && "bg-slate-200/80 text-slate-600",
            task.status === "running" && "bg-blue-200/80 text-blue-800",
            task.status === "completed" && "bg-emerald-200/80 text-emerald-800",
            task.status === "failed" && "bg-red-200/80 text-red-800",
            task.status === "retrying" && "bg-amber-200/80 text-amber-800"
          )}
        >
          {task.status}
        </span>
      </div>
      <p className="truncate text-xs font-medium capitalize text-slate-800">
        {task.type.replace(/_/g, " ")}
      </p>
      <p className="truncate text-[11px] text-slate-500">{task.modelName}</p>
      <div className="mt-2 space-y-0.5 font-mono text-[11px] text-slate-600">
        <p>{formatCurrencyPrecise(task.cost)}</p>
        <p className="text-slate-500">{formatLatency(task.latencyMs)}</p>
      </div>
    </div>
  )
}

export function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  const statusClass = getStatusColor(pipeline.status)

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{pipeline.projectTitle}</h3>
          <p className="text-xs text-slate-500">
            Started {new Date(pipeline.startedAt).toLocaleString()}
            {pipeline.completedAt && (
              <> · Completed {new Date(pipeline.completedAt).toLocaleString()}</>
            )}
          </p>
        </div>
        <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold capitalize", statusClass)}>
          {pipeline.status}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4 font-mono text-sm text-slate-600">
        <span>
          Total: <span className="font-semibold text-slate-900">{formatCurrencyPrecise(pipeline.totalCost)}</span>
        </span>
        <span className="hidden sm:inline text-slate-300">|</span>
        <span>
          Wall time:{" "}
          <span className="font-semibold text-slate-900">{pipeline.totalTime}s</span>
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-min items-stretch gap-0">
          {pipeline.tasks.map((task, i) => (
            <div key={task.id} className="flex items-center">
              {i > 0 && (
                <div className="flex h-full items-center px-1 text-slate-300">
                  <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                </div>
              )}
              <TaskNode task={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
