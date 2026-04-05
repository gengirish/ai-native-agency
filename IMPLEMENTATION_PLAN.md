# AI-Native Agency Platform — Implementation Plan

> A 24-week plan to go from zero to first paying clients. Organized into 6 phases, each building on the last. The goal: prove the unit economics with real revenue before scaling.

---

## Guiding Principles

- **Ship the vertical, not the platform.** Pick one agency type (e.g., design) and build the thinnest possible pipeline end-to-end. Resist the temptation to build horizontal infrastructure before you have paying clients.
- **Manual before automated.** Use humans where the system isn't ready yet. Automate what hurts the most first.
- **Revenue on Week 8.** The first client should be paying before half the plan is complete. Everything before that is building toward the first billable project.
- **Measure the margin.** Track cost-per-project from day one. If the margin isn't 70%+, something is wrong.

---

## Timeline Overview

```
Phase 1: Foundation          Weeks 1–4     Infrastructure + Auth + Data Layer
Phase 2: AI Engine MVP       Weeks 5–8     Core AI pipeline for one vertical
Phase 3: Client Experience   Weeks 9–12    Portal, briefs, delivery, first clients
Phase 4: Human-in-the-Loop   Weeks 13–16   Expert review, QA, refinement tools
Phase 5: Business Operations Weeks 17–20   Billing, CRM, analytics, scaling ops
Phase 6: Scale & Optimize    Weeks 21–24   Multi-model routing, knowledge loops, second vertical
```

---

## Phase 1: Foundation (Weeks 1–4)

**Goal:** Core infrastructure, database schema, authentication, and the AI gateway that everything else will build on.

### Week 1–2: Project Setup & Infrastructure

| Task | Details | Owner |
|------|---------|-------|
| Monorepo setup | Initialize repo with Next.js frontend, Python/Node backend services, shared types | Backend |
| Database schema | PostgreSQL: tenants, users, projects, briefs, deliverables, revisions, assets | Backend |
| Auth system | Multi-tenant auth with Clerk or Auth0. Roles: admin, expert, client | Backend |
| CI/CD pipeline | GitHub Actions → Docker → AWS ECS or GCP Cloud Run | DevOps |
| Dev environment | Docker Compose for local dev with all services | DevOps |

### Week 3–4: AI Gateway & Storage

| Task | Details | Owner |
|------|---------|-------|
| Multi-model AI gateway | Abstraction layer over OpenAI, Anthropic, and one image model (Midjourney API or Replicate). Unified request/response format, cost tracking per call, retry logic | Backend |
| Asset storage | S3 bucket with presigned URLs, folder-per-tenant structure, image/video/document support | Backend |
| Vector store setup | Pinecone or Weaviate instance. Schema for brand assets, templates, work history | Backend |
| Cost tracking | Log every AI API call: model, tokens, cost, latency, project ID. Postgres table + dashboard query | Backend |

### Phase 1 Deliverables
- [ ] Running monorepo with frontend and backend services
- [ ] PostgreSQL database with tenant isolation
- [ ] Auth system with admin, expert, and client roles
- [ ] AI gateway that can call OpenAI, Anthropic, and an image model
- [ ] S3 storage with per-tenant isolation
- [ ] Vector store instance ready for embeddings
- [ ] CI/CD deploying to staging environment

---

## Phase 2: AI Engine MVP (Weeks 5–8)

**Goal:** Build the AI production pipeline for one vertical. By end of Phase 2, the system can take a brief and produce a deliverable.

> **Choose your first vertical now.** The rest of this phase assumes **design agency** (brand assets, marketing collateral, social graphics). Swap in legal/content/video if that's your beachhead.

### Week 5–6: Task Decomposition & Pipeline

| Task | Details | Owner |
|------|---------|-------|
| Brief schema | Define structured brief format for design projects: project type, brand colors, tone, dimensions, target audience, reference images | Product |
| Task decomposer | Service that parses a brief and generates a list of subtasks with dependencies. Start rule-based, upgrade to LLM-based later | AI Eng |
| Pipeline orchestrator | Temporal.io workflow that executes subtasks in dependency order. Handles: parallel execution, retries (3x), timeout (5 min per task), error capture | Backend |
| Design generation module | Integration with image generation APIs. Prompt engineering layer that translates design briefs into model-specific prompts. Support: logos, social graphics, business cards, brand color palettes | AI Eng |

### Week 7–8: QA & End-to-End Testing

| Task | Details | Owner |
|------|---------|-------|
| QA validation service | Automated checks: image resolution, format compliance, brand color matching (compare generated palette against brief), text readability | AI Eng |
| Brand context injection | Load client brand guidelines from vector store and inject into prompts. Few-shot examples from template library | AI Eng |
| End-to-end pipeline test | Submit 20 test briefs across different project types. Measure: completion rate, average time, cost per project, quality score (manual 1–5 rating) | QA |
| Pipeline dashboard | Internal admin view: active pipelines, task status, error logs, cost breakdown | Frontend |

### Phase 2 Deliverables
- [ ] Brief schema for design projects
- [ ] Task decomposer that breaks briefs into subtasks
- [ ] Temporal workflow executing the full pipeline
- [ ] Design generation module producing logos, graphics, and collateral
- [ ] QA service catching resolution/format/brand issues
- [ ] 20 test briefs completed end-to-end with quality scores
- [ ] Internal pipeline dashboard

### Phase 2 Success Metrics
| Metric | Target |
|--------|--------|
| Pipeline completion rate | > 90% |
| Average time per project | < 10 minutes |
| Average AI cost per project | < $5 |
| Manual quality score (1–5) | > 3.5 average |

---

## Phase 3: Client Experience (Weeks 9–12)

**Goal:** Build the client-facing portal and onboard the first 3–5 paying clients.

### Week 9–10: Client Portal & Brief Builder

| Task | Details | Owner |
|------|---------|-------|
| Client portal | Next.js app: login, project list, project detail, file downloads. Clean, minimal, premium feel. No mention of AI anywhere | Frontend |
| Brief builder | Multi-step form: project type selection → details → brand upload → reference images → submit. Validates completeness before submission | Frontend |
| Brand onboarding flow | Upload brand guidelines (PDF/images), extract colors/fonts/tone via LLM, store in brand knowledge base. Client reviews and confirms extracted brand profile | AI Eng + Frontend |
| Email notifications | Transactional emails: brief received, project in progress, deliverable ready for review, revision requested | Backend |

### Week 11–12: Review Hub & First Clients

| Task | Details | Owner |
|------|---------|-------|
| Review & approval hub | Side-by-side view of deliverables with inline commenting. Approve, request revision, or reject buttons. Version history | Frontend |
| Revision loop | Client comments → re-enter pipeline with original brief + feedback → regenerate → human review → re-deliver | Backend + AI Eng |
| Client onboarding | Manually onboard 3–5 design clients. White-glove setup of brand profiles. Offer first project free or at deep discount to validate | Founders |
| Speculative work engine | For sales: generate sample deliverables from a prospect's existing brand (scrape their website for colors/logo/tone) without them submitting a brief | AI Eng |

### Phase 3 Deliverables
- [ ] Client portal with login, project tracking, file downloads
- [ ] Brief builder with brand upload and validation
- [ ] Brand onboarding flow (upload → extract → confirm)
- [ ] Review hub with commenting and approval workflow
- [ ] Revision loop working end-to-end
- [ ] 3–5 paying clients onboarded
- [ ] Speculative work engine for sales demos

### Phase 3 Success Metrics
| Metric | Target |
|--------|--------|
| Client onboarding time | < 1 hour |
| Brief-to-first-draft time | < 15 minutes |
| Client satisfaction (NPS) | > 40 |
| First revenue collected | > $0 |

---

## Phase 4: Human-in-the-Loop (Weeks 13–16)

**Goal:** Build the expert review layer that transforms AI output from "good" to "premium" and justifies agency pricing.

### Week 13–14: Expert Review Dashboard

| Task | Details | Owner |
|------|---------|-------|
| Expert dashboard | Internal tool: queue of projects awaiting review, priority sorting (client tier, deadline, project value), claim and review flow | Frontend |
| Refinement interface | Inline editing on generated assets. Controls: regenerate with modified prompt, adjust colors/layout, swap elements, crop/resize. Direct Photoshop/Figma plugin if feasible | Frontend + AI Eng |
| Review workflow integration | Pipeline pauses after QA, expert claims project, reviews/refines, marks as approved → triggers client notification | Backend |
| Expert assignment | Rule-based assignment: match expert specialty to project type. Support for manual reassignment and load balancing | Backend |

### Week 15–16: Escalation & Quality Tracking

| Task | Details | Owner |
|------|---------|-------|
| Escalation system | Experts can flag projects as "needs senior review" or "requires manual work." Escalated projects route to senior specialist with full context | Backend |
| Quality scoring | Every deliverable gets a quality score: automated (QA checks) + expert rating + client feedback. Tracked per expert, per project type, per model | Backend |
| Expert performance dashboard | Time-to-review, revision rate, client satisfaction per expert. Identify bottlenecks | Frontend |
| Feedback-to-prompt loop | Client revision feedback and expert refinement patterns are logged and used to improve future prompt templates | AI Eng |

### Phase 4 Deliverables
- [ ] Expert review dashboard with project queue and claiming
- [ ] Refinement interface with regeneration and editing tools
- [ ] Review workflow integrated into pipeline (pause → review → approve)
- [ ] Escalation system for complex projects
- [ ] Quality scoring across automated, expert, and client dimensions
- [ ] Expert performance tracking
- [ ] Feedback loop from revisions back to prompt improvement

### Phase 4 Success Metrics
| Metric | Target |
|--------|--------|
| Expert review time per project | < 15 minutes |
| Post-review client revision rate | < 20% |
| Expert utilization | > 70% of available hours |
| Quality score improvement | +0.5 vs. Phase 2 baseline |

---

## Phase 5: Business Operations (Weeks 17–20)

**Goal:** Build the business systems needed to scale beyond founder-led sales and manual invoicing.

### Week 17–18: Billing & Pricing

| Task | Details | Owner |
|------|---------|-------|
| Billing engine | Stripe integration: project-based invoicing, credit packs (buy 10 projects, use anytime), monthly retainers with included project volume | Backend |
| Pricing tiers | 3 tiers: Starter (self-serve, longer turnaround), Professional (priority queue, faster turnaround), Enterprise (dedicated expert, custom SLA) | Product |
| Usage tracking | Track per-client: projects submitted, credits remaining, AI cost, expert hours, margin per client | Backend |
| Invoice generation | Automated invoices on project completion or monthly for retainer clients. PDF generation + email delivery | Backend |

### Week 19–20: CRM, Analytics & Client Dashboard

| Task | Details | Owner |
|------|---------|-------|
| CRM integration | HubSpot or built-in: track leads, demos (speculative work), proposals, conversions. Auto-log client interactions | Backend |
| Client analytics dashboard | Client-facing: project history, spend, deliverable library, brand asset repository, ROI metrics | Frontend |
| Internal analytics | Founder dashboard: revenue, margin per project, margin per client, CAC, LTV, pipeline value, expert utilization, model cost trends | Frontend |
| Margin alerts | Automated alerts when project margin drops below 70% threshold. Flag high-cost projects for investigation | Backend |

### Phase 5 Deliverables
- [ ] Stripe billing with project, credit pack, and retainer models
- [ ] 3 pricing tiers configured
- [ ] Usage tracking and margin-per-client reporting
- [ ] Automated invoice generation
- [ ] CRM for lead and client management
- [ ] Client-facing analytics dashboard
- [ ] Internal founder dashboard with unit economics
- [ ] Margin alerts for low-profit projects

### Phase 5 Success Metrics
| Metric | Target |
|--------|--------|
| Average margin per project | > 75% |
| Monthly recurring revenue | Growing month over month |
| Invoice-to-payment time | < 7 days |
| Client retention (monthly) | > 90% |

---

## Phase 6: Scale & Optimize (Weeks 21–24)

**Goal:** Optimize the engine, add intelligence, and prepare for the second vertical.

### Week 21–22: Model Optimization & Knowledge Loops

| Task | Details | Owner |
|------|---------|-------|
| Model router | Intelligent model selection: route tasks to the best model based on quality benchmarks, cost, latency, and project tier. A/B test new models against incumbents | AI Eng |
| Knowledge feedback loop | Every approved deliverable → embed in vector store → improve future retrieval. Client-specific style learning: the system gets better at each client's brand over time | AI Eng |
| Prompt optimization | Analyze top-performing prompts (highest quality score, lowest revision rate). Build prompt template library. Auto-select best template per project type | AI Eng |
| Cost optimization | Identify tasks where cheaper models perform equally. Route commodity tasks to cheaper models, reserve premium models for high-value work | AI Eng |

### Week 23–24: Second Vertical & Growth

| Task | Details | Owner |
|------|---------|-------|
| Second vertical | Add one new specialized module (content/copy or video/ad). Reuse 100% of orchestration, knowledge, expert review, and client portal layers. Only build: new brief schema, new task templates, new model integrations | AI Eng + Product |
| Template marketplace | Internal library of proven project templates. When a new client submits a brief similar to past work, pre-populate the pipeline with the best-performing template | AI Eng |
| Onboarding automation | Self-serve client signup: enter website URL → auto-extract brand → generate sample project → show result → convert to paid | Frontend + AI Eng |
| API access (optional) | REST API for power clients who want to integrate project submission into their own tools | Backend |

### Phase 6 Deliverables
- [ ] Model router with intelligent selection and A/B testing
- [ ] Knowledge feedback loop improving with each project
- [ ] Prompt template library with auto-selection
- [ ] Cost optimization reducing AI spend by 30%+
- [ ] Second vertical live with first projects completed
- [ ] Template marketplace for internal reuse
- [ ] Self-serve onboarding flow
- [ ] API access for enterprise clients (optional)

### Phase 6 Success Metrics
| Metric | Target |
|--------|--------|
| AI cost per project | 30% lower than Phase 2 |
| Quality score | > 4.0 average |
| Second vertical time-to-launch | < 2 weeks (proving reuse) |
| Self-serve conversion rate | > 10% of visitors |
| Monthly active clients | 20+ |

---

## Team Requirements

### Phase 1–3 (Weeks 1–12): Founding Team

| Role | Count | Focus |
|------|-------|-------|
| Technical Co-founder / Lead Eng | 1 | Architecture, AI gateway, pipeline orchestrator |
| Full-Stack Engineer | 1 | Client portal, brief builder, review hub |
| AI Engineer | 1 | Prompt engineering, task decomposer, design module |
| Founder / BD | 1 | Client acquisition, brand onboarding, sales demos |

### Phase 4–6 (Weeks 13–24): Scaling Team

| Role | Count | Focus |
|------|-------|-------|
| Domain Expert (Designer) | 1–2 | Human review, quality assurance, refinement |
| Backend Engineer | 1 | Billing, CRM, workflow scaling |
| Data / ML Engineer | 1 | Knowledge loops, model routing, cost optimization |

**Total at launch: 4 people. Total at Week 24: 7–8 people.**

---

## Budget Estimate (24 Weeks)

| Category | Monthly Cost | 6-Month Total |
|----------|-------------|---------------|
| Cloud infrastructure (AWS/GCP) | $2,000 | $12,000 |
| AI API costs (OpenAI, Anthropic, image models) | $1,000–$3,000 | $6,000–$18,000 |
| Vector store (Pinecone/Weaviate) | $200 | $1,200 |
| Auth service (Clerk/Auth0) | $100 | $600 |
| Monitoring (Datadog/equivalent) | $300 | $1,800 |
| Domain experts (contract) | $3,000 | $18,000 |
| Misc (domains, email, tools) | $200 | $1,200 |
| **Total (excl. founder salaries)** | **$6,800–$8,800** | **$40,800–$52,800** |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI output quality too low for premium pricing | Medium | Critical | Heavy human review in early phases. Only take projects in your strongest vertical. Build quality scoring early to identify problem areas |
| Client expects traditional agency communication (calls, meetings) | High | Medium | Set expectations during sales. Offer premium tier with account manager. Build excellent async communication into the portal |
| Model provider API changes / price increases | Medium | High | Model-agnostic gateway from day one. Always have fallback model for every task type. Track cost trends weekly |
| Expert reviewers become bottleneck | Medium | High | Track utilization. Hire ahead of demand. Invest in refinement tools that reduce review time. Automate more QA over time |
| Client data privacy / security concern | Medium | Critical | Tenant isolation from day one. SOC 2 preparation starting Phase 4. Clear data handling policy in client contracts |
| Slow initial client acquisition | High | High | Speculative work engine for demos. Free first project. Case studies from early clients. Founder-led sales for first 20 clients |

---

## Key Milestones

| Week | Milestone | Validation |
|------|-----------|------------|
| 4 | Infrastructure complete | AI gateway returns results, database seeded, auth working |
| 8 | First end-to-end project | Brief in → deliverable out with < $5 AI cost |
| 10 | Client portal live | Real client can log in, submit brief, download result |
| 12 | **First revenue** | At least 1 client pays for a completed project |
| 16 | Expert review operational | All deliverables pass through human review before delivery |
| 20 | Billing automated | Clients charged automatically, margin tracked per project |
| 24 | Second vertical + 20 clients | Platform reuse proven, sustainable unit economics |

---

## Decision Log

Track key decisions as you build. Fill in as you go.

| Date | Decision | Rationale | Revisit By |
|------|----------|-----------|------------|
| | First vertical chosen: _________ | | |
| | Image model selected: _________ | | |
| | LLM provider selected: _________ | | |
| | Pricing model finalized: _________ | | |
| | Expert hiring model: FT / contract | | |
| | Self-serve vs. sales-led: _________ | | |
