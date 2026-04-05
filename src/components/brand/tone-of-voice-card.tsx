"use client"

import type { BrandProfile } from "@/types"

type ToneOfVoiceCardProps = Pick<
  BrandProfile,
  "toneOfVoice" | "values" | "targetAudience" | "competitors"
>

export function ToneOfVoiceCard({
  toneOfVoice,
  values,
  targetAudience,
  competitors,
}: ToneOfVoiceCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Tone of voice</h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-700">{toneOfVoice}</p>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Brand values</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-900"
            >
              {v}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target audience</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{targetAudience}</p>
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Competitors</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {competitors.map((c) => (
            <li
              key={c}
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-800"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
