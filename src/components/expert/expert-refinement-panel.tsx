"use client"

import type { ExpertAssignment } from "@/types"
import { cn } from "@/lib/utils"
import { RefreshCw, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

const SWAP_OPTIONS = [
  "Hero ↔ CTA block",
  "Headline ↔ subhead",
  "Logo placement: top / corner",
  "Image grid ↔ text column",
]

type ExpertRefinementPanelProps = {
  assignment: ExpertAssignment | null
}

export function ExpertRefinementPanel({ assignment }: ExpertRefinementPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [hue, setHue] = useState(42)
  const [saturation, setSaturation] = useState(68)
  const [brightness, setBrightness] = useState(55)
  const [layoutDensity, setLayoutDensity] = useState(40)
  const [swap, setSwap] = useState(SWAP_OPTIONS[0])

  if (!assignment) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center shadow-sm">
        <SlidersHorizontal className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-600">No assignment selected</p>
        <p className="mt-1 text-sm text-slate-500">
          Choose a queue item to open refinement tools
        </p>
      </div>
    )
  }

  const hasAfter =
    assignment.status === "completed" && assignment.qualityAfter > 0

  return (
    <div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Refinement Tools</h2>
          <p className="mt-0.5 text-sm text-slate-500">{assignment.projectTitle}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </button>
      </div>

      <div>
        <label htmlFor="refine-prompt" className="text-sm font-medium text-slate-700">
          Prompt modification
        </label>
        <textarea
          id="refine-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe changes for the next generation pass…"
          className="mt-2 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700">Color adjustment</p>
        <div className="mt-3 space-y-4">
          <SliderRow label="Hue" value={hue} onChange={setHue} />
          <SliderRow label="Saturation" value={saturation} onChange={setSaturation} />
          <SliderRow label="Brightness" value={brightness} onChange={setBrightness} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700">Adjust layout</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Tighter", "Balanced", "Airy"].map((label, i) => {
            const v = (i + 1) * 33
            const active = Math.abs(layoutDensity - v) < 17
            return (
              <button
                key={label}
                type="button"
                onClick={() => setLayoutDensity(v)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={layoutDensity}
          onChange={(e) => setLayoutDensity(Number(e.target.value))}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
        />
      </div>

      <div>
        <label htmlFor="swap-elements" className="text-sm font-medium text-slate-700">
          Swap elements
        </label>
        <select
          id="swap-elements"
          value={swap}
          onChange={(e) => setSwap(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {SWAP_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">Quality comparison</p>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Before</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-500">
              {assignment.qualityBefore.toFixed(1)}
            </p>
          </div>
          <div className="text-slate-400">→</div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">After</p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tabular-nums",
                hasAfter ? "text-emerald-600" : "text-slate-400"
              )}
            >
              {hasAfter ? assignment.qualityAfter.toFixed(1) : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-medium text-slate-600">{label}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
      />
      <span className="w-8 tabular-nums text-right text-xs text-slate-500">{value}</span>
    </div>
  )
}
