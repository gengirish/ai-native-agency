"use client"

import { Zap } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-400">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="mt-1 font-mono text-xs text-slate-600">Error ID: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  )
}
