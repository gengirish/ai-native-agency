import type { InvoiceStatus } from "@/types"
import { cn, getStatusColor } from "@/lib/utils"

const invoiceExtra: Partial<Record<InvoiceStatus, string>> = {
  sent: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
}

export function invoiceStatusBadgeClass(status: InvoiceStatus): string {
  if (invoiceExtra[status]) return invoiceExtra[status]!
  return getStatusColor(status)
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        invoiceStatusBadgeClass(status),
      )}
    >
      {status}
    </span>
  )
}
