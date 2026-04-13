"use client"

import { AlertTriangle, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Something went wrong</h2>
        <p className="mt-1 text-sm text-slate-500">
          This page encountered an error. You can try again or navigate to another section.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-slate-400">ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
