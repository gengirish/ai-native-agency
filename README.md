# AgencyOS — AI-Native Agency Platform

**AgencyOS** is the operating system for AI-native creative agencies. One control plane for project briefs, brand DNA, AI production pipelines, expert QA, SLA tracking, billing, and performance analytics — so teams ship client work at software-like margins.

**Live demo:** [agencyos.intelliforge.tech](https://agencyos.intelliforge.tech)

---

## Investor Demo Walkthrough

The platform ships with pre-seeded data and one-click login for three roles. No setup required — just open the live URL.

### Step 1 — Login (one click)

Visit `/login`. Three demo accounts are available with instant access:

| Button | Role | Name | What they see |
|--------|------|------|---------------|
| **Agency Admin** | `admin` | Priya Kapoor | Full platform — all 17 modules |
| **Expert Reviewer** | `expert` | Maya Okonkwo | Review queue, QA, deliverable feedback |
| **Client** | `client` | Sarah Chen | Projects, brand assets, billing |

### Step 2 — Dashboard

Revenue metrics ($857K total, 66% margins), active project count, pipeline value, AI autonomous rate, expert utilization — all from seeded data that tells a coherent business story.

### Step 3 — Projects & AI Generation

- **Seeded projects:** 6 projects across logo design, social media, brand identity, ad creative, email campaigns, and marketing collateral — each at different pipeline stages.
- **View AI Output:** Click any project with deliverables to see AI-generated content (the Apex Freight logo project has a pre-seeded 3-concept creative brief).
- **Live AI generation:** Submit a new brief through the wizard → the platform calls a real AI model (OpenRouter → Groq → Gemini fallback chain) and shows the generated deliverable with model, latency, token count, and cost metrics.

### Step 4 — Full Platform Tour

| Module | Route | Highlights |
|--------|-------|------------|
| Review Hub | `/review` | Threaded feedback between clients and experts |
| Brand DNA | `/brand` | Color palettes, fonts, tone-of-voice, DNA scores |
| CRM & Sales | `/crm` | 4 leads ($284K pipeline), drag-drop status |
| AI Gateway | `/ai-engine` | Model registry, pipeline visualization, live task status |
| Autonomy Engine | `/autonomy` | Per-task-type confidence → human-required / spot-check / autonomous |
| Expert Queue | `/expert` | Assignment routing, escalation levels, quality deltas |
| Performance | `/performance` | CTR, ROI, spend by channel with real ad metrics |
| Creative Director | `/proactive` | AI-suggested upsells based on trends |
| Auto-Publish | `/publishing` | Channel integrations (Meta, Google, IG, Mailchimp) |
| Benchmarks | `/benchmarks` | Industry comparison — turnaround, satisfaction, margin |
| SLA Management | `/sla` | Tier-based SLAs with compliance tracking |
| Billing | `/billing` | Invoices, credit packs, usage records |
| Analytics | `/analytics` | Revenue trends, cost breakdown, margin analysis |
| Feedback Copilot | `/feedback` | Client feedback → structured actionable items |

### Step 5 — Role Switching

Log out and one-click into a different role to demonstrate RBAC. Experts see a subset (review queue, QA). Clients see only their projects and billing.

---

## Quick Start (Local Development)

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/gengirish/ai-native-agency.git
cd ai-native-agency
npm install
cp .env.example .env    # then add your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo users work out of the box.

### Environment Variables

Create `.env` from `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | For AI generation | Primary AI provider ([openrouter.ai](https://openrouter.ai)) |
| `GROQ_API_KEY` | Fallback | Fast inference fallback ([console.groq.com](https://console.groq.com)) |
| `GEMINI_API_KEY` | Fallback | Google Gemini fallback ([aistudio.google.com](https://aistudio.google.com)) |
| `TAVILY_API_KEY` | Optional | Search-enriched generation (future) |
| `PERPLEXITY_API_KEY` | Optional | Search-enriched generation (future) |
| `DATABASE_URL` | Optional | PostgreSQL (for future real backend) |
| `NEXT_PUBLIC_USE_DEMO_DATA` | Optional | `true` (default) seeds demo data; `false` for empty state |

**Never commit `.env`** — it is gitignored. API keys are set on Vercel via `vercel env add`.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 15 App                    │
│  ┌───────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  App      │  │  API     │  │  Middleware       │  │
│  │  Router   │  │  Routes  │  │  (JWT cookie      │  │
│  │  (React   │  │  (28     │  │   gate)           │  │
│  │   19 +    │  │  route   │  └──────────────────┘  │
│  │   Tailwind│  │  handlers│                        │
│  │   CSS)    │  │  )       │  ┌──────────────────┐  │
│  │           │  │          │  │  AI Gateway       │  │
│  │  17 pages │  │  CRUD +  │  │  OpenRouter →     │  │
│  │  + brief  │  │  auth +  │  │  Groq → Gemini   │  │
│  │  wizard   │  │  generate│  │  (auto failover)  │  │
│  └───────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  In-Memory Store (globalThis)                 │   │
│  │  Seeded from demo-data.ts on cold start       │   │
│  │  4 demo users · 6 projects · deliverables ·   │   │
│  │  reviews · leads · pipelines · brands · ...   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **In-memory store over database for demos:** `src/lib/store.ts` uses `globalThis` to persist across API requests within a single serverless instance. Resets on cold start — fine for demos, replaceable with Postgres/KV for production.
- **Custom JWT auth (no NextAuth):** Lightweight JWT signing/verification via Web Crypto API in `src/lib/auth/jwt.ts`. Token stored in `localStorage` (API calls) + cookie (middleware gate). No external auth dependency.
- **Multi-provider AI gateway:** `src/lib/ai/gateway.ts` routes through OpenRouter (primary), Groq (fast), Gemini (fallback) with automatic failover, cost estimation, and latency tracking.
- **Seeded demo users:** 4 users pre-loaded with IDs matching project/review/expert data for a coherent narrative.

---

## Seeded Demo Data

### Users

| ID | Name | Email | Role | Password |
|----|------|-------|------|----------|
| `u_admin` | Priya Kapoor | admin@agencyos.demo | admin | demo123 |
| `exp_maya` | Maya Okonkwo | maya@agencyos.demo | expert | demo123 |
| `exp_jordan` | Jordan Lee | jordan@agencyos.demo | expert | demo123 |
| `u_client_lumen` | Sarah Chen | sarah@agencyos.demo | client | demo123 |

### Projects

| ID | Title | Type | Status | Client |
|----|-------|------|--------|--------|
| `proj_lumen` | Lumen Analytics — full rebrand | Brand identity | Client review | Lumen Analytics |
| `proj_pulse` | Pulse Health — Q2 social motion kit | Social media | Expert review | Pulse Health |
| `proj_north` | Northwind — performance creative A/B | Ad creative | QA check | Northwind Commerce |
| `proj_vertex` | Vertex Labs — investor one-pager + deck | Marketing collateral | Delivered | Vertex Labs |
| `proj_apex` | Apex Freight — logo refinement | Logo design | QA check | Apex Freight |
| `proj_kite` | Kite Bank — lifecycle email series | Email campaign | Draft | Kite Bank |

### Additional Data

- **4 deliverables** with version history and quality scores
- **3 reviews** with threaded comments between clients and experts
- **3 expert assignments** with escalation levels and quality deltas
- **4 CRM leads** ($284K combined pipeline value)
- **2 AI pipelines** (one running, one completed) with per-task cost tracking
- **4 AI models** registered (Claude, GPT-4o, FLUX Pro, Runway Gen-3)
- **2 brand profiles** with colors, fonts, tone of voice, DNA scores
- **6 months of revenue data** ($118K → $168K trajectory)
- **1 pre-seeded AI generation** (Apex Freight logo: 3 concept directions with rationale)

---

## API Routes

All routes are Next.js Route Handlers under `src/app/api/`.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register with name, email, password, role → JWT |
| POST | `/api/auth/login` | Login with email, password → JWT |
| GET | `/api/auth/me` | Get current user from Bearer token |

### AI Generation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/generate` | Generate deliverable from brief (real AI call) |
| GET | `/api/projects/[id]/generated` | Get seeded/cached generation result |

### CRUD & Data

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/projects` | List / create projects |
| GET/PATCH | `/api/projects/[id]` | Get / update project |
| GET | `/api/reviews` | List reviews |
| GET/PATCH | `/api/reviews/[id]` | Get / update review |
| POST | `/api/reviews/[id]/comments` | Add comment to review |
| GET | `/api/leads` | List CRM leads |
| PATCH | `/api/leads/[id]` | Update lead status |
| GET | `/api/brands` | List brand profiles |
| GET | `/api/deliverables` | List deliverables |
| GET | `/api/dashboard/stats` | Dashboard metrics |
| GET | `/api/billing` | Invoices, credit packs, usage |
| GET | `/api/pipelines` | AI pipeline runs |
| GET | `/api/experts` | Expert assignments |
| GET | `/api/models` | AI model registry |
| GET | `/api/autonomy` | Autonomy configurations |
| GET | `/api/performance` | Channel performance metrics |
| GET | `/api/suggestions` | Proactive creative suggestions |
| GET | `/api/feedback` | Feedback translations |
| GET | `/api/publishing` | Publishing jobs + channel configs |
| GET | `/api/benchmarks` | Industry benchmarks |
| GET | `/api/sla` | SLA tiers + compliance |
| GET | `/api/revenue` | Monthly revenue metrics |
| GET | `/api/costs` | Cost breakdown |

---

## Auth System

```
Login page → POST /api/auth/login → JWT returned
                                    ↓
                        Stored in localStorage (API calls)
                        + cookie "agencyos_token" (middleware)
                                    ↓
            Middleware checks cookie → redirect to /login if missing
            API routes check Bearer header → 401 if invalid
```

- **RBAC:** 3 roles (admin, expert, client) with 30+ granular permissions
- **Route gating:** `src/middleware.ts` redirects unauthenticated requests
- **Component gating:** `<RequireRole permission="...">` wraps protected UI
- **Permission matrix:** `src/lib/auth/permissions.ts`

---

## AI Gateway

`src/lib/ai/gateway.ts` — unified `generate()` function with:

- **Provider chain:** OpenRouter → Groq → Gemini (first available key wins)
- **Auto-failover:** If primary returns non-200, tries next provider
- **Cost estimation:** Per-provider token rates
- **Latency tracking:** Wall-clock ms per generation
- **Per-project-type prompts:** 9 tailored system prompts (logo, social, brand, video, legal, blog, email, ad, collateral)

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `next dev --turbopack` | Local dev with hot reload |
| `npm run dev:e2e` | `next dev -H 127.0.0.1 -p 3000` | Playwright-compatible server |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Run production build |
| `npm run lint` | `next lint` | ESLint check |
| `npm run test:e2e` | `playwright test` | Run E2E tests |
| `npm run test:e2e:live` | `BASE_URL=... playwright test` | E2E against deployed URL |
| `npm run test:e2e:ui` | `playwright test --ui` | Playwright UI mode |

---

## Deployment

Deployed on **Vercel**. See `.cursor/skills/deploy-vercel/SKILL.md`.

```bash
npx vercel --prod --yes --scope girish-hiremaths-projects
```

Environment variables are set via `vercel env add <KEY> production --value "<value>"`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, Lucide icons |
| Charts | Recharts |
| Auth | Custom JWT (Web Crypto API) |
| AI | OpenRouter, Groq, Google Gemini |
| State | In-memory store (`globalThis`) |
| Deployment | Vercel (serverless) |
| Testing | Playwright |
| Language | TypeScript 5.7 |

---

## Project Structure

```
src/
├── app/
│   ├── api/                    28 API route handlers
│   │   ├── auth/               login, register, me
│   │   ├── generate/           AI generation endpoint
│   │   ├── projects/           CRUD + generated results
│   │   ├── reviews/            CRUD + comments
│   │   └── ...                 leads, brands, billing, etc.
│   ├── dashboard/              Main dashboard
│   ├── projects/               Project list + brief wizard + AI results
│   ├── login/                  Auth + one-click demo login
│   └── ...                     16 more feature pages
├── components/
│   ├── auth/                   RequireRole, permission guards
│   ├── brief/                  5-step brief wizard
│   ├── layout/                 AppShell, sidebar, navigation
│   ├── marketing/              Landing page
│   ├── review/                 Review hub with threaded comments
│   └── ui/                     Shared UI components
├── lib/
│   ├── ai/gateway.ts           Multi-provider AI gateway
│   ├── auth/                   JWT, permissions, context
│   ├── api.ts                  Client-side API functions
│   ├── demo-data.ts            Seeded demo dataset
│   ├── store.ts                In-memory data store
│   └── utils.ts                Formatting helpers
└── types/
    └── index.ts                40+ TypeScript interfaces
```

## License

MIT
