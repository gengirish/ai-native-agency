import { NextRequest, NextResponse } from "next/server"
import { generate } from "@/lib/ai/gateway"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { createDeliverable, getProjectById, updateProject } from "@/lib/dal"
import type { ProjectType } from "@/types"

const TYPE_PROMPTS: Record<ProjectType, string> = {
  logo_design:
    "You are a world-class brand designer. Generate a detailed creative brief breakdown, logo concept description, moodboard direction, and 3 distinct logo concept directions with rationale for each.",
  social_media:
    "You are an expert social media strategist. Generate a content calendar overview, 5 post concepts with captions, hashtag strategy, and engagement tactics for the brand.",
  brand_identity:
    "You are a brand identity specialist. Generate a complete brand identity system including values, voice guidelines, visual direction, typography recommendations, and color palette rationale.",
  marketing_collateral:
    "You are a marketing creative director. Generate concepts for a cohesive marketing collateral suite including brochure outline, flyer concepts, presentation deck structure, and business card design direction.",
  video_ad:
    "You are a video advertising creative director. Generate a 30-second video ad script with scene-by-scene breakdown, voiceover text, visual direction, music/sound design notes, and a call-to-action strategy.",
  legal_document:
    "You are a legal document specialist. Generate a well-structured document outline, key clauses to include, compliance considerations, and plain-language summaries for each section.",
  blog_content:
    "You are an expert content strategist. Generate 3 blog post outlines with SEO-optimized titles, meta descriptions, section breakdowns, and internal linking strategy.",
  email_campaign:
    "You are an email marketing specialist. Generate a 5-email drip sequence with subject lines, preview text, body copy outlines, CTAs, and segmentation recommendations.",
  ad_creative:
    "You are a performance marketing creative director. Generate ad copy variations for 3 platforms (Meta, Google, LinkedIn) with headlines, descriptions, CTA options, and A/B testing recommendations.",
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }

    const body = (await request.json()) as {
      projectId: string
      title: string
      type: ProjectType
      description?: string
      clientName?: string
      budget?: number
    }

    if (!body.projectId || !body.type) {
      return NextResponse.json(
        { error: "projectId and type are required" },
        { status: 400 },
      )
    }

    const project = await getProjectById(body.projectId, user.tenantId)
    if (!project) {
      return NextResponse.json(
        { error: { message: "Not found", code: "NOT_FOUND" } },
        { status: 404 },
      )
    }
    if (project.clientId !== user.tenantId) {
      return NextResponse.json(
        { error: { message: "Not found", code: "NOT_FOUND" } },
        { status: 404 },
      )
    }

    await updateProject(body.projectId, { status: "ai_generating" })

    try {
      const systemPrompt = TYPE_PROMPTS[body.type] ?? TYPE_PROMPTS.blog_content

      const userPrompt = [
        `Project: ${body.title}`,
        body.description ? `Description: ${body.description}` : null,
        body.clientName ? `Client: ${body.clientName}` : null,
        body.budget ? `Budget: $${body.budget.toLocaleString()}` : null,
        `\nGenerate a comprehensive, production-ready deliverable for this project. Format your output with clear sections using markdown headers. Be specific, creative, and actionable.`,
      ]
        .filter(Boolean)
        .join("\n")

      const startTime = Date.now()

      const result = await generate({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        maxTokens: 3000,
        temperature: 0.75,
      })

      const generationTime = Date.now() - startTime

      const deliverable = await createDeliverable({
        projectId: body.projectId,
        tenantId: user.tenantId,
        title: `${body.title} — AI Draft`,
        type: body.type,
        fileUrl: result.content,
        aiModel: result.model,
        generationCost: result.cost,
        generationTime,
        qualityScore: 0.85,
        status: "qa_check",
      })

      const nextAiCost = project.aiCost + result.cost
      await updateProject(body.projectId, {
        status: "qa_check",
        aiCost: nextAiCost,
      })

      return NextResponse.json({
        deliverable,
        generation: {
          content: result.content,
          model: result.model,
          provider: result.provider,
          tokensUsed: result.tokensUsed,
          latencyMs: result.latencyMs,
          cost: result.cost,
        },
      })
    } catch (err) {
      await updateProject(body.projectId, { status: "draft" }).catch(() => {})
      console.error("[API] POST /api/generate:", err)
      return NextResponse.json({ error: "Generation failed" }, { status: 500 })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
