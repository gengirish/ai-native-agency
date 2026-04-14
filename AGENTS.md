# AGENTS.md — AgencyOS

Quick orientation for AI coding agents working in this repository.

## What this is

**AgencyOS** — an AI-native agency operating system built with Next.js 15 (App Router), React 19, Tailwind CSS, TypeScript, and Neon Postgres. Deployed on Vercel.

**Live:** [agencyos.intelliforge.tech](https://agencyos.intelliforge.tech)

## Product story

- **Positioning:** One control plane for briefs, brand DNA, AI pipelines, expert QA, billing, and performance — software-like economics for creative delivery.
- **Demo mode:** When `DATABASE_URL` is not set, the app falls back to an in-memory store with 4 seeded users, 6 projects, and full data narrative. One-click login on `/login`.
- **Real mode:** When `DATABASE_URL` is set, all queries hit Neon Postgres. Demo data is seeded via `npm run db:seed`.

## Data architecture

All API routes use the **Data Access Layer** (`src/lib/dal.ts`). No route imports `store` directly.

```
API Routes → DAL → DATABASE_URL set?
                     ├── Yes → Neon Postgres (25+ tables, 9 migrations)
                     └── No  → In-memory store (demo-data.ts fallback)
```

## Code layout

| Area | Path | Notes |
|------|------|-------|
| Pages (17 routes) | `src/app/*/page.tsx` | Dashboard, projects, CRM, reviews, etc. |
| API routes (31) | `src/app/api/**/route.ts` | Auth, CRUD, AI generation, feedback translate, expert/publish mutations |
| Components | `src/components/` | Brief wizard, review hub, layout, UI |
| Client API layer | `src/lib/api.ts` | All `fetch()` calls to API routes |
| **Data Access Layer** | `src/lib/dal.ts` | 30+ functions, dual-mode (Postgres ↔ in-memory) |
| **Database client** | `src/lib/db.ts` | Neon serverless tagged-template SQL |
| AI gateway | `src/lib/ai/gateway.ts` | OpenRouter → Groq → Gemini failover |
| Auth (JWT) | `src/lib/auth/` | `jwt.ts`, `context.tsx`, `permissions.ts` |
| Demo data | `src/lib/demo-data.ts` | Fallback dataset for in-memory mode |
| In-memory store | `src/lib/store.ts` | `globalThis` store — only used by DAL as fallback |
| Types | `src/types/index.ts` | 40+ interfaces |
| Middleware | `src/middleware.ts` | Cookie-based JWT gate |
| Migrations | `db/migrations/*.sql` | 9 migration files, 25+ tables |
| Seed script | `db/seed.js` | Full demo data seeder (idempotent, transactional) |

## Auth system

Custom JWT (no NextAuth) + bcrypt password hashing.

1. `POST /api/auth/login` → bcrypt verify → returns `{ user, token }`
2. `POST /api/auth/register` → bcrypt hash → creates user in DB/store → JWT
3. Client stores token in `localStorage` + cookie (`agencyos_token`)
4. API calls use `Authorization: Bearer <token>`
5. Middleware checks cookie, redirects to `/login` if missing
6. 3 roles: `admin` (full access), `expert` (review/QA), `client` (projects/billing)

### Seeded demo users

| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@agencyos.demo | demo123 | admin | Priya Kapoor |
| maya@agencyos.demo | demo123 | expert | Maya Okonkwo |
| jordan@agencyos.demo | demo123 | expert | Jordan Lee |
| sarah@agencyos.demo | demo123 | client | Sarah Chen |

## AI gateway

`src/lib/ai/gateway.ts` — `generate()` with automatic provider failover:

1. **OpenRouter** (primary) — `OPENROUTER_API_KEY`
2. **Groq** (fast/cheap) — `GROQ_API_KEY`
3. **Gemini** (fallback) — `GEMINI_API_KEY`

Used by: `/api/generate` (deliverable generation), `/api/feedback/translate` (feedback → actionable items), CRM speculative work flow.

## Database

Neon Postgres with `@neondatabase/serverless`. Schema managed via raw SQL migrations in `db/migrations/`.

```bash
npm run db:migrate    # Apply pending migrations
npm run db:seed       # Seed demo data (idempotent)
```

Key tables: `tenants`, `users`, `projects`, `briefs`, `deliverables`, `expert_reviews`, `client_feedback`, `leads`, `pipeline_runs`, `pipeline_tasks`, `invoices`, `brand_profiles`, `ai_models`, `expert_assignments`, `autonomy_configs`, `performance_metrics`, `suggestions`, `feedback_translations`, `publishing_jobs`, `channel_configs`, `benchmarks`, `sla_tiers`, `sla_compliance`, `credit_packs`, `revenue_metrics`, `cost_breakdown`, `usage_records`.

## Cursor configuration

### Rules

| File | Scope |
|------|-------|
| `.cursor/rules/project.mdc` | Express/Postgres conventions |
| `.cursor/rules/next-frontend.mdc` | Next.js App Router + React |
| `.cursor/rules/api-routes.mdc` | API route conventions |
| `.cursor/rules/services.mdc` | Service layer conventions |

### Skills (5 project-specific)

| Skill | Purpose |
|-------|---------|
| `agencyos-yc-product` | YC-caliber product discipline and demo integrity |
| `deploy-vercel` | Ship to Vercel (incl. `--scope` for non-interactive) |
| `playwright-e2e` | E2E tests with `BASE_URL` support |
| `email-and-notifications` | Resend vs AgentMail for transactional email |
| `identify-quality-resources` | Resource quality evaluation |

## Commands

```bash
npm install
npm run dev              # Turbopack dev server
npm run build            # Production build
npm run db:migrate       # Apply database migrations
npm run db:seed          # Seed demo data
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:live    # E2E against deployed URL
```

## Deploy

```bash
npx vercel --prod --yes --scope girish-hiremaths-projects
```

## Key files to read first

1. `src/lib/dal.ts` — how data is accessed (dual-mode: Postgres ↔ in-memory)
2. `src/lib/db.ts` — Neon serverless connection
3. `src/lib/ai/gateway.ts` — how AI calls work
4. `src/lib/auth/permissions.ts` — RBAC matrix
5. `src/lib/api.ts` — client ↔ API contract
6. `db/migrations/` — database schema
