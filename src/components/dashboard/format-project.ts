import type { ProjectStatus, ProjectType } from "@/types"

const TYPE_LABELS: Record<ProjectType, string> = {
  logo_design: "Logo Design",
  social_media: "Social Media",
  brand_identity: "Brand Identity",
  marketing_collateral: "Marketing Collateral",
  video_ad: "Video Ad",
  legal_document: "Legal Document",
  blog_content: "Blog Content",
  email_campaign: "Email Campaign",
  ad_creative: "Ad Creative",
}

export function formatProjectType(type: ProjectType): string {
  return TYPE_LABELS[type] ?? type
}

export function formatStatusLabel(status: ProjectStatus | string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
