"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const icons: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles: Record<ToastType, string> = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  }

  const iconStyles: Record<ToastType, string> = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
  }

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      >
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm animate-in slide-in-from-right-full fade-in duration-300",
                styles[t.type],
              )}
              role="status"
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconStyles[t.type])} aria-hidden />
              <p className="flex-1">{t.message}</p>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
