import type { ReviewStatus } from "@/types"
import { getStatusColor } from "@/lib/utils"

const reviewStatusColorKey: Record<ReviewStatus, string> = {
  pending: "pending",
  approved: "approved",
  revision_requested: "revision",
  rejected: "failed",
}

export function getReviewStatusBadgeClass(status: ReviewStatus): string {
  return getStatusColor(reviewStatusColorKey[status])
}

export function formatReviewStatusLabel(status: ReviewStatus): string {
  const labels: Record<ReviewStatus, string> = {
    pending: "Pending",
    approved: "Approved",
    revision_requested: "Revision Requested",
    rejected: "Rejected",
  }
  return labels[status]
}
