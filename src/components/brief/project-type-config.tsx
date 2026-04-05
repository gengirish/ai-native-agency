import type { LucideIcon } from "lucide-react"
import {
  FileStack,
  FileText,
  Mail,
  Megaphone,
  Palette,
  Scale,
  Share2,
  Sparkles,
  Video,
} from "lucide-react"
import type { ProjectType } from "@/types"

export interface ProjectTypeOption {
  type: ProjectType
  label: string
  description: string
  icon: LucideIcon
}

export const PROJECT_TYPE_OPTIONS: ProjectTypeOption[] = [
  {
    type: "logo_design",
    label: "Logo Design",
    description: "Marks, wordmarks, and logo systems for print and digital.",
    icon: Palette,
  },
  {
    type: "social_media",
    label: "Social Media",
    description: "Posts, stories, and templates tuned for each platform.",
    icon: Share2,
  },
  {
    type: "brand_identity",
    label: "Brand Identity",
    description: "Full visual systems: color, type, and guidelines.",
    icon: Sparkles,
  },
  {
    type: "marketing_collateral",
    label: "Marketing Collateral",
    description: "Decks, one-pagers, and sales-ready materials.",
    icon: FileStack,
  },
  {
    type: "video_ad",
    label: "Video & Ads",
    description: "Short-form video, motion, and campaign cuts.",
    icon: Video,
  },
  {
    type: "legal_document",
    label: "Legal & Compliance",
    description: "Review-ready documents and compliant copy blocks.",
    icon: Scale,
  },
  {
    type: "blog_content",
    label: "Blog & SEO",
    description: "Long-form articles, outlines, and on-page SEO.",
    icon: FileText,
  },
  {
    type: "email_campaign",
    label: "Email Campaign",
    description: "Sequences, headers, and lifecycle messaging.",
    icon: Mail,
  },
  {
    type: "ad_creative",
    label: "Ad Creative",
    description: "Display, paid social, and performance creative sets.",
    icon: Megaphone,
  },
]

export function formatProjectTypeLabel(type: ProjectType): string {
  return PROJECT_TYPE_OPTIONS.find((o) => o.type === type)?.label ?? type.replace(/_/g, " ")
}
