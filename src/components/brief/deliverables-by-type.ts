import type { ProjectType } from "@/types"

export interface DeliverableTemplate {
  id: string
  label: string
  defaultQty: number
}

export const DELIVERABLES_BY_TYPE: Record<ProjectType, DeliverableTemplate[]> = {
  logo_design: [
    { id: "logo-concepts", label: "Logo concepts", defaultQty: 3 },
    { id: "wordmark", label: "Wordmark lockups", defaultQty: 2 },
    { id: "icon-mark", label: "Icon / symbol mark", defaultQty: 1 },
    { id: "usage-guide", label: "Usage guidelines (PDF)", defaultQty: 1 },
  ],
  social_media: [
    { id: "feed-posts", label: "Feed posts", defaultQty: 8 },
    { id: "stories", label: "Story frames", defaultQty: 4 },
    { id: "templates", label: "Editable templates", defaultQty: 2 },
    { id: "captions", label: "Caption copy sets", defaultQty: 1 },
  ],
  brand_identity: [
    { id: "logo-suite", label: "Logo suite", defaultQty: 1 },
    { id: "palette", label: "Color palette", defaultQty: 1 },
    { id: "typography", label: "Typography system", defaultQty: 1 },
    { id: "guidelines", label: "Brand guidelines PDF", defaultQty: 1 },
  ],
  marketing_collateral: [
    { id: "pitch-deck", label: "Pitch deck", defaultQty: 1 },
    { id: "one-pager", label: "One-pager", defaultQty: 2 },
    { id: "case-study", label: "Case study template", defaultQty: 1 },
  ],
  video_ad: [
    { id: "script", label: "Script / VO", defaultQty: 1 },
    { id: "storyboard", label: "Storyboard frames", defaultQty: 1 },
    { id: "rough-cut", label: "Rough cut (30–60s)", defaultQty: 1 },
    { id: "final-cut", label: "Final master", defaultQty: 1 },
  ],
  legal_document: [
    { id: "review", label: "Document review memo", defaultQty: 1 },
    { id: "redlines", label: "Redlined terms", defaultQty: 1 },
    { id: "summary", label: "Client summary (plain language)", defaultQty: 1 },
  ],
  blog_content: [
    { id: "articles", label: "Blog articles", defaultQty: 4 },
    { id: "outlines", label: "Content outlines", defaultQty: 4 },
    { id: "seo-meta", label: "SEO meta packs", defaultQty: 1 },
  ],
  email_campaign: [
    { id: "emails", label: "Emails in sequence", defaultQty: 5 },
    { id: "headers", label: "Header graphics", defaultQty: 5 },
    { id: "subject-lines", label: "Subject line variants", defaultQty: 1 },
  ],
  ad_creative: [
    { id: "display", label: "Display ad sizes", defaultQty: 6 },
    { id: "social-ads", label: "Paid social statics", defaultQty: 4 },
    { id: "video-ads", label: "Short video ads", defaultQty: 2 },
  ],
}
