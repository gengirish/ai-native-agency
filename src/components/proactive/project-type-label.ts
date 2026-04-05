import type { ProjectType } from "@/types"

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
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

export function projectTypeLabel(type: ProjectType): string {
  return PROJECT_TYPE_LABELS[type] ?? type
}
