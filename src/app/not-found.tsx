import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <FileQuestion className="h-6 w-6 text-slate-400" />
        </div>
        <h1 className="text-5xl font-bold text-slate-300">404</h1>
        <h2 className="mt-2 text-lg font-semibold text-slate-700">Page not found</h2>
        <p className="mt-1 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
