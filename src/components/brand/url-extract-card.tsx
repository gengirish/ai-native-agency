"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Globe, Loader2, Sparkles } from "lucide-react"

const STEPS = [
  "Scanning website",
  "Extracting colors",
  "Analyzing typography",
  "Building brand profile",
] as const

export function UrlExtractCard() {
  const [url, setUrl] = useState("")
  const [running, setRunning] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const timersRef = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const runMockExtraction = () => {
    clearTimers()
    setRunning(true)
    setActiveStep(0)
    for (let i = 1; i < STEPS.length; i++) {
      const id = window.setTimeout(() => setActiveStep(i), i * 900)
      timersRef.current.push(id)
    }
    const doneId = window.setTimeout(() => {
      setRunning(false)
      setActiveStep(STEPS.length)
      clearTimers()
    }, (STEPS.length - 1) * 900 + 800)
    timersRef.current.push(doneId)
  }

  const handleExtract = () => {
    if (running) return
    runMockExtraction()
  }

  return (
    <section className="rounded-xl border-2 border-violet-200 bg-gradient-to-b from-white to-violet-50/40 p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md">
          <Sparkles className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">Extract Brand DNA from URL</h3>
          <p className="mt-1 text-sm text-slate-600">
            Paste any website URL and we&apos;ll extract colors, fonts, tone, and style in 60 seconds.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Globe
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <button
              type="button"
              onClick={handleExtract}
              disabled={running}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Extracting…
                </>
              ) : (
                "Extract"
              )}
            </button>
          </div>
          <ol className="mt-6 space-y-3">
            {STEPS.map((label, i) => {
              const done = activeStep > i
              const current = activeStep === i
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors",
                    done && "border-emerald-200 bg-emerald-50/80 text-emerald-900",
                    current && "border-violet-300 bg-violet-50 text-violet-900",
                    !done && !current && "border-slate-100 bg-white/60 text-slate-500"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      done && "bg-emerald-500 text-white",
                      current && "bg-violet-600 text-white",
                      !done && !current && "bg-slate-200 text-slate-600"
                    )}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="font-medium">{label}</span>
                  {current && running && (
                    <Loader2 className="ml-auto h-4 w-4 animate-spin text-violet-600" aria-hidden />
                  )}
                </li>
              )
            })}
          </ol>
          {activeStep >= STEPS.length && !running && (
            <p className="mt-4 text-sm font-medium text-emerald-700">
              Mock extraction complete — review results above or save as a new brand profile.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
