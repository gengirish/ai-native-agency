# AgencyOS — AI-Native Agency Platform

**AgencyOS** is the operating system for AI-native creative agencies. One control plane for project briefs, brand DNA, AI production pipelines, expert QA, SLA tracking, billing, and performance analytics — so teams ship client work at software-like margins.

**Live demo:** [agencyos.intelliforge.tech](https://agencyos.intelliforge.tech)

---

## Features

### Core Platform (17 modules)

| Module | Route | Description |
|--------|-------|-------------|
| **Dashboard** | `/dashboard` | Revenue ($857K total, 66% margins), active projects, pipeline value, AI autonomous rate, expert utilization |
| **Projects** | `/projects` | Project list with filtering by status/type, brief creation wizard, AI generation results |
| **Brief Wizard** | `/projects/new` | 5-step guided intake: project type → goals → brand DNA → audience → timeline → AI generation |
| **Review Hub** | `/review` | Threaded feedback between clients and experts with quality scoring, version history, and status tracking |
| **Brand DNA** | `/brand` | Color palettes, fonts, tone-of-voice, DNA scores, URL-based brand extraction |
| **CRM & Sales** | `/crm` | Lead management ($284K pipeline), status tracking, speculative AI work generation to win deals |
| **AI Gateway** | `/ai-engine` | Model registry, pipeline visualization, live task status, cost telemetry |
| **Autonomy Engine** | `/autonomy` | Per-task-type confidence scoring → autonomous / spot-check / human-required |
| **Expert Queue** | `/expert` | Assignment routing, claim/complete/escalate flows persisted via API, quality deltas |
| **Performance** | `/performance` | CTR, ROI, spend by channel with real ad metrics |
| **Creative Director** | `/proactive` | AI-suggested upsells based on trends and performance data |
| **Auto-Publish** | `/publishing` | Channel integrations (Meta, Google, IG, Mailchimp) with publish/schedule flows via API |
| **Benchmarks** | `/benchmarks` | Industry comparison — turnaround (88th percentile), satisfaction, margin (91st percentile) |
| **SLA Management** | `/sla` | Tier-based SLAs (Starter / Professional / Enterprise) with compliance tracking |
| **Billing** | `/billing` | Invoices, credit packs ($499–$6,999), usage records, margin analysis |
| **Analytics** | `/analytics` | Revenue trends, cost breakdown, 6-month trajectory ($118K → $168K/mo) |
| **Feedback Copilot** | `/feedback` | AI-powered client feedback → structured actionable items (real AI translation when keys configured) |

### AI Generation (Real)

- **Multi-provider gateway:** OpenRouter → Groq → Gemini with automatic failover
- **Live generation:** Submit a brief → real AI model generates deliverable with model name, latency, token count, and cost metrics displayed
- **Per-project-type prompts:** 9 tailored system prompts (logo, social, brand, video, legal, blog, email, ad, collateral)
- **Cost tracking:** Per-deliverable AI cost metering and margin analysis
- **Speculative work:** CRM leads can trigger AI generation to create sample work before contracts are signed

### Authentication & RBAC

- **Custom JWT auth** — no external auth dependency, Edge-compatible (Web Crypto API)
- **3 roles:** Admin (full access, 17 modules), Expert (review queue, QA), Client (projects, billing)
- **30+ granular permissions** with component-level gating (`<RequireRole>`)
- **bcrypt password hashing** for real users; demo accounts use known credentials
- **One-click demo login** on `/login` with 4 pre-seeded accounts

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Next.js 15 App                           │
│  ┌───────────┐  ┌────────────┐  ┌──────────────────────────┐ │
│  │  17 Pages │  │  31 API    │  │  Middleware               │ │
│  │  (React   │  │  Routes    │  │  (JWT cookie gate)        │ │
│  │   19 +    │  │  (auth,    │  │                           │ │
│  │   Tailwind│  │   CRUD,    │  │  AI Gateway               │ │
│  │   CSS +   │  │   gen,     │  │  OpenRouter → Groq →      │ │
│  │   Recharts│  │   translate │  │  Gemini (auto failover)   │ │
│  │          )│  │   publish) │  │                           │ │
│  └───────────┘  └─────┬──────┘  └──────────────────────────┘ │
│                       │                                       │
│               ┌───────▼────────┐                              │
│               │  Data Access   │                              │
│               │  Layer (DAL)   │                              │
│               └──┬──────────┬──┘                              │
│                  │          │                                  │
│       ┌──────────▼──┐  ┌───▼──────────────────────┐          │
│       │ Neon Postgres│  │ In-Memory Store          │          │
│       │ (when        │  │ (fallback when no        │          │
│       │  DATABASE_URL│  │  DATABASE_URL — demo     │          │
│       │  is set)     │  │  mode, resets on cold    │          │
│       │              │  │  start)                  │          │
│       │ 25+ tables   │  │                          │          │
│       │ 9 migrations │  │ 4 users · 6 projects ·   │          │
│       │ Full seed    │  │ deliverables · reviews · │          │
│       └──────────────┘  └──────────────────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Dual-mode Data Access Layer:** `src/lib/dal.ts` abstracts all data queries. When `DATABASE_URL` is set, queries hit Neon Postgres. When unset, falls back to the in-memory store — demo mode works with zero setup.
- **No API route touches the store directly.** All 31 routes go through the DAL.
- **Custom JWT auth (no NextAuth):** Lightweight JWT signing/verification via Web Crypto API. Token stored in `localStorage` (API calls) + cookie (middleware gate).
- **Multi-provider AI gateway:** `src/lib/ai/gateway.ts` routes through OpenRouter (primary), Groq (fast), Gemini (fallback) with automatic failover, cost estimation, and latency tracking.
- **bcrypt for real users:** New registrations use `bcrypt.hashSync(password, 10)`. Demo accounts support both hashed and plaintext password comparison for backward compatibility.

---

## Investor Demo Walkthrough

The platform ships with pre-seeded data and one-click login for three roles. No setup required — just open the live URL.

### Step 1 — Login (one click)

Visit `/login`. Four demo accounts are available:

| Button | Role | Name | What they see |
|--------|------|------|---------------|
| **Agency Admin** | `admin` | Priya Kapoor | Full platform — all 17 modules |
| **Expert Reviewer** | `expert` | Maya Okonkwo | Review queue, QA, deliverable feedback |
| **Client** | `client` | Sarah Chen | Projects, brand assets, billing |

### Step 2 — Dashboard

Revenue metrics ($857K total, 66% margins), active project count, pipeline value, AI autonomous rate, expert utilization.

### Step 3 — Projects & AI Generation

- **6 seeded projects** across logo design, social media, brand identity, ad creative, email campaigns, and marketing collateral
- **View AI Output:** Click any project with deliverables to see AI-generated content
- **Live AI generation:** Submit a new brief → real AI model generates deliverable with metrics

### Step 4 — CRM Speculative Work

Navigate to `/crm` → select a lead → "Generate sample work" → AI creates a speculative deliverable tied to the lead — demonstrating how agencies win deals before contracts are signed.

### Step 5 — Role Switching

Log out and one-click into a different role to demonstrate RBAC. Experts see review queue and QA. Clients see only their projects and billing.

---

## Quick Start

### Option A — Demo mode (no database)

```bash
git clone https://github.com/gengirish/ai-native-agency.git
cd ai-native-agency
npm install
cp .env.example .env    # add AI keys for real generation (optional)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo users and seeded data work out of the box.

### Option B — Real database (Neon Postgres)

```bash
git clone https://github.com/gengirish/ai-native-agency.git
cd ai-native-agency
npm install
cp .env.example .env
# Add your Neon DATABASE_URL and AI keys to .env

npm run db:migrate     # Apply 9 migration files (25+ tables)
npm run db:seed        # Seed demo data (4 users, 6 projects, full dataset)
npm run dev
```

All data now persists in Postgres. New users register with bcrypt-hashed passwords.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For real data | Neon Postgres connection string ([neon.tech](https://neon.tech)) |
| `OPENROUTER_API_KEY` | For AI generation | Primary AI provider ([openrouter.ai](https://openrouter.ai)) |
| `GROQ_API_KEY` | Fallback | Fast inference fallback ([console.groq.com](https://console.groq.com)) |
| `GEMINI_API_KEY` | Fallback | Google Gemini fallback ([aistudio.google.com](https://aistudio.google.com)) |
| `TAVILY_API_KEY` | Optional | Search-enriched generation (future) |
| `PERPLEXITY_API_KEY` | Optional | Search-enriched generation (future) |

**Never commit `.env`** — it is gitignored.

---

## Database

### Schema (25+ tables across 9 migrations)

| Migration | Tables |
|-----------|--------|
| 001 | `tenants`, `users` |
| 002 | `brand_profiles`, `brand_assets` |
| 003 | `projects`, `briefs` |
| 004 | `pipeline_runs`, `pipeline_tasks` |
| 005 | `deliverables`, `expert_reviews`, `client_feedback` |
| 006 | `credit_balances`, `invoices`, `ai_cost_log`, `templates` |
| 007 | `project_quality_scores` |
| 008 | `users.password_hash` column |
| 009 | `leads`, `ai_models`, `expert_assignments`, `autonomy_configs`, `performance_metrics`, `suggestions`, `feedback_translations`, `publishing_jobs`, `channel_configs`, `benchmarks`, `sla_tiers`, `sla_compliance`, `credit_packs`, `revenue_metrics`, `cost_breakdown`, `usage_records` |

### Data Access Layer

`src/lib/dal.ts` — 30+ exported functions covering every entity:

```
                    ┌─────────────────┐
  API Routes ──────►│      DAL        │
                    │  (src/lib/dal)  │
                    └──┬───────────┬──┘
                       │           │
           DATABASE_URL?        No DATABASE_URL?
                       │           │
               ┌───────▼──┐  ┌────▼──────────┐
               │  Neon     │  │  In-Memory    │
               │  Postgres │  │  Store        │
               └──────────┘  └───────────────┘
```

### Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run db:migrate` | `node db/migrate.js` | Apply pending SQL migrations |
| `npm run db:seed` | `node db/seed.js` | Seed demo data (idempotent, transactional) |

---

## API Routes

All routes are Next.js Route Handlers under `src/app/api/`. All use the DAL — no route accesses the store directly.

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register with name, email, password, role → bcrypt hash → JWT |
| POST | `/api/auth/login` | Login with email, password → bcrypt verify → JWT |
| GET | `/api/auth/me` | Get current user from Bearer token |

### AI

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/generate` | Generate deliverable from brief (real AI call via gateway) |
| POST | `/api/feedback/translate` | AI-powered feedback translation (real AI or demo fallback) |
| GET | `/api/projects/[id]/generated` | Get generation result for a project |

### CRUD

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/projects` | List / create projects |
| GET/PATCH | `/api/projects/[id]` | Get / update project |
| GET/POST | `/api/leads` | List / create CRM leads |
| PATCH | `/api/leads/[id]` | Update lead status, notes, speculative work URL |
| GET | `/api/reviews` | List reviews |
| GET/PATCH | `/api/reviews/[id]` | Get / update review status and rating |
| POST | `/api/reviews/[id]/comments` | Add comment to review (uses authenticated user) |
| PATCH | `/api/experts/[id]` | Update expert assignment (claim, complete, escalate) |
| PATCH | `/api/publishing/[id]` | Update publishing job status (publish, schedule) |
| GET | `/api/brands` | List brand profiles |
| GET | `/api/deliverables` | List deliverables |

### Read-Only Data

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/stats` | Dashboard metrics (computed from real data when DB connected) |
| GET | `/api/billing` | Invoices, credit packs, usage records |
| GET | `/api/pipelines` | AI pipeline runs with task details |
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
Login page → POST /api/auth/login → bcrypt verify → JWT returned
                                                    ↓
                                    Stored in localStorage (API calls)
                                    + cookie "agencyos_token" (middleware)
                                                    ↓
                    Middleware checks cookie → redirect to /login if missing
                    API routes check Bearer header → 401 if invalid
```

- **RBAC:** 3 roles (admin, expert, client) with 30+ granular permissions
- **Password security:** bcrypt hash for real users; demo accounts support plaintext fallback
- **Route gating:** `src/middleware.ts` redirects unauthenticated requests
- **Component gating:** `<RequireRole permission="...">` wraps protected UI

### Seeded Demo Users

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@agencyos.demo | demo123 | admin | Priya Kapoor |
| maya@agencyos.demo | demo123 | expert | Maya Okonkwo |
| jordan@agencyos.demo | demo123 | expert | Jordan Lee |
| sarah@agencyos.demo | demo123 | client | Sarah Chen |

---

## AI Gateway

`src/lib/ai/gateway.ts` — unified `generate()` function with:

- **Provider chain:** OpenRouter → Groq → Gemini (first available key wins)
- **Auto-failover:** If primary returns non-200, tries next provider
- **Cost estimation:** Per-provider token rates
- **Latency tracking:** Wall-clock ms per generation
- **Per-project-type prompts:** 9 tailored system prompts

Used by:
- `POST /api/generate` — deliverable generation from briefs
- `POST /api/feedback/translate` — client feedback → actionable items
- CRM speculative work — generate sample deliverables to win leads

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `next dev --turbopack` | Local dev with hot reload |
| `npm run dev:e2e` | `next dev -H 127.0.0.1 -p 3000` | Playwright-compatible server |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Run production build |
| `npm run lint` | `next lint` | ESLint check |
| `npm run db:migrate` | `node db/migrate.js` | Apply database migrations |
| `npm run db:seed` | `node db/seed.js` | Seed demo data (idempotent) |
| `npm run test:e2e` | `playwright test` | Run E2E tests |
| `npm run test:e2e:live` | `BASE_URL=... playwright test` | E2E against deployed URL |
| `npm run test:e2e:ui` | `playwright test --ui` | Playwright UI mode |

---

## Deployment

Deployed on **Vercel** with Neon Postgres.

```bash
# Set env vars
vercel env add DATABASE_URL production
vercel env add OPENROUTER_API_KEY production
vercel env add GROQ_API_KEY production
vercel env add GEMINI_API_KEY production

# Deploy
npx vercel --prod --yes --scope girish-hiremaths-projects
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS, Lucide icons |
| Charts | Recharts |
| Database | Neon Postgres (serverless) with raw SQL migrations |
| Auth | Custom JWT (Web Crypto API) + bcrypt |
| AI | OpenRouter, Groq, Google Gemini |
| Data layer | DAL with dual-mode (Postgres / in-memory fallback) |
| Deployment | Vercel (serverless) |
| Testing | Playwright (55 E2E tests) |
| Language | TypeScript 5.7 |

---

## Project Structure

```
src/
├── app/
│   ├── api/                    31 API route handlers
│   │   ├── auth/               login, register, me
│   │   ├── generate/           AI generation endpoint
│   │   ├── feedback/translate/  AI feedback translation
│   │   ├── projects/           CRUD + generated results
│   │   ├── reviews/            CRUD + comments
│   │   ├── experts/[id]/       Expert assignment mutations
│   │   ├── publishing/[id]/    Publishing job mutations
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
│   ├── dal.ts                  Data Access Layer (Postgres ↔ in-memory)
│   ├── db.ts                   Neon serverless connection
│   ├── demo-data.ts            Demo dataset (in-memory fallback)
│   ├── store.ts                In-memory store (fallback only)
│   └── utils.ts                Formatting helpers
├── types/
│   └── index.ts                40+ TypeScript interfaces
db/
├── connection.js               pg Pool for migration/seed scripts
├── migrate.js                  SQL migration runner
├── seed.js                     Full demo data seeder (idempotent)
├── reset.js                    Drop all tables (--yes to confirm)
└── migrations/
    ├── 001_tenants_and_users.sql
    ├── 002_brand_knowledge.sql
    ├── 003_projects_and_briefs.sql
    ├── 004_pipeline_and_tasks.sql
    ├── 005_deliverables_and_reviews.sql
    ├── 006_billing_and_analytics.sql
    ├── 007_project_quality_scores.sql
    ├── 008_users_password_hash.sql
    └── 009_missing_tables.sql
```

## License

MIT
