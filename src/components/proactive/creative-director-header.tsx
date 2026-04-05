import { Sparkles } from "lucide-react"

export function CreativeDirectorHeader() {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Sparkles className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Creative Director
          </h1>
          <p className="mt-1 text-slate-600">
            AI-powered proactive project suggestions and trend monitoring
          </p>
        </div>
      </div>
    </header>
  )
}
