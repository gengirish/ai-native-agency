# AGENTS.md — AgencyOS

Quick orientation for AI coding agents working in this repository.

## What this is

**AgencyOS** — a full-stack AI-native agency operating system. Next.js 15 (App Router) + React 19 + Tailwind CSS + TypeScript frontend, with Neon Postgres backend and a dual-mode Data Access Layer. Deployed on Vercel.

**Live:** [agencyos.intelliforge.tech](https://agencyos.intelliforge.tech)

**Status:** Full-stack with real Postgres. All 55 E2E tests pass against the live deployment.

## Architecture

```
Browser → Next.js Pages → src/lib/api.ts (fetch)
                               ↓
                     src/app/api/**/route.ts (31 routes)
                               ↓
                        src/lib/dal.ts (Data Access Layer)
                               ↓
                   DATABASE_URL set? ─── Yes → Neon Postgres (25+ tables)
                                    └── No  → In-memory store (demo fallback)
```

**Key rule:** All API routes import from `@/lib/dal`, never from `@/lib/store` directly.

## Code layout

| Area | Path | Notes |
|------|------|-------|
| Pages (17 routes) | `src/app/*/page.tsx` | Dashboard, projects, CRM, reviews, etc. |
| API routes (31) | `src/app/api/**/route.ts` | Auth, CRUD, AI generation, mutations |
| Components | `src/components/` | Brief wizard, review hub, layout, UI |
| Client API layer | `src/lib/api.ts` | All `fetch()` calls to API routes |
| **Data Access Layer** | `src/lib/dal.ts` | 30+ functions, dual-mode Postgres ↔ in-memory |
| **Database client** | `src/lib/db.ts` | Neon `@neondatabase/serverless` tagged-template SQL |
| AI gateway | `src/lib/ai/gateway.ts` | OpenRouter → Groq → Gemini failover |
| Auth (JWT) | `src/lib/auth/` | `jwt.ts`, `context.tsx`, `permissions.ts` |
| Demo data | `src/lib/demo-data.ts` | Fallback dataset when no DATABASE_URL |
| In-memory store | `src/lib/store.ts` | `globalThis` store — DAL fallback only |
| Types | `src/types/index.ts` | 40+ interfaces |
| Middleware | `src/middleware.ts` | Cookie-based redirect gate |
| Migrations | `db/migrations/*.sql` | 9 files, 25+ tables |
| Seed script | `db/seed.js` | Idempotent transactional seeder |
| E2E tests | `e2e/*.spec.ts` | 55 Playwright tests, all passing |

## Database

Neon Postgres via `@neondatabase/serverless` (API routes) and `pg` (CLI scripts).

```bash
npm run db:migrate    # Apply pending migrations
npm run db:seed       # Seed demo data (idempotent)
```

### DAL patterns (important for contributors)

- `src/lib/db.ts` exports `getDb()` (tagged-template SQL) and `hasDb()` (boolean check)
- **Do NOT use nested sql template fragments** for conditional WHERE clauses — Neon's driver doesn't support `sql` fragment interpolation. Use two-branch queries instead:

```typescript
// WRONG — will cause SQL syntax errors
const rows = await sql`SELECT * FROM projects ${tenantId ? sql`WHERE tenant_id = ${tenantId}` : sql``}`

// RIGHT — separate queries
const rows = tenantId
  ? await sql`SELECT * FROM projects WHERE tenant_id = ${tenantId}::uuid`
  : await sql`SELECT * FROM projects`
```

- Map snake_case DB columns to camelCase in explicit `map*Row` functions
- Money is stored as integer cents, converted to dollars at the DAL boundary
- UUIDs everywhere — cast with `::uuid` in queries

### Key tables

`tenants`, `users`, `projects`, `briefs`, `deliverables`, `expert_reviews`, `client_feedback`, `leads`, `pipeline_runs`, `pipeline_tasks`, `invoices`, `brand_profiles`, `ai_models`, `expert_assignments`, `autonomy_configs`, `performance_metrics`, `suggestions`, `feedback_translations`, `publishing_jobs`, `channel_configs`, `benchmarks`, `sla_tiers`, `sla_compliance`, `credit_packs`, `revenue_metrics`, `cost_breakdown`, `usage_records`.

## Auth system

Custom JWT (no NextAuth) + bcrypt password hashing.

1. `POST /api/auth/login` → bcrypt verify → returns `{ user, token }`
2. `POST /api/auth/register` → bcrypt hash → creates user → JWT
3. Client stores token in `localStorage` + cookie (`agencyos_token`)
4. API calls use `Authorization: Bearer <token>`
5. Middleware checks cookie, redirects to `/login` if missing
6. 3 roles: `admin` (full access), `expert` (review/QA), `client` (projects/billing)

### Seeded demo users (password: `demo123`)

| Email | Role | Name | UUID |
|-------|------|------|------|
| admin@agencyos.demo | admin | Priya Kapoor | `00000000-...-000000000010` |
| maya@agencyos.demo | expert | Maya Okonkwo | `00000000-...-000000000011` |
| jordan@agencyos.demo | expert | Jordan Lee | `00000000-...-000000000012` |
| sarah@agencyos.demo | client | Sarah Chen | `00000000-...-000000000013` |

## AI gateway

`src/lib/ai/gateway.ts` — `generate()` with automatic provider failover:

1. **OpenRouter** (primary) — `OPENROUTER_API_KEY`
2. **Groq** (fast/cheap) — `GROQ_API_KEY`
3. **Gemini** (fallback) — `GEMINI_API_KEY`

## Cursor configuration

### Rules

| File | Scope |
|------|-------|
| `.cursor/rules/project.mdc` | Full-stack conventions (Next.js + Postgres + DAL) |
| `.cursor/rules/next-frontend.mdc` | Next.js App Router + React components |
| `.cursor/rules/api-routes.mdc` | Next.js API route conventions |
| `.cursor/rules/services.mdc` | DAL / service layer patterns |

### Skills (6 project-specific)

| Skill | Purpose |
|-------|---------|
| `agencyos-yc-product` | YC-caliber product discipline and demo integrity |
| `deploy-vercel` | Ship to Vercel (incl. `--scope` for non-interactive) |
| `playwright-e2e` | E2E tests with `BASE_URL` support |
| `full-stack-sync` | Keep features, code, docs, and tests in sync |
| `email-and-notifications` | Resend vs AgentMail for transactional email |
| `identify-quality-resources` | Resource quality evaluation |

## Commands

```bash
npm install
npm run dev              # Turbopack dev server
npm run build            # Production build
npm run db:migrate       # Apply database migrations
npm run db:seed          # Seed demo data
npm run test:e2e         # Playwright E2E (55 tests)
npm run test:e2e:live    # E2E against deployed URL
```

## Deploy

```bash
npx vercel --prod --yes --scope girish-hiremaths-projects
```

## Feature development order

When adding a feature, follow this order:

1. Database migration (`db/migrations/NNN_description.sql`)
2. DAL function in `src/lib/dal.ts` (Postgres path + in-memory fallback)
3. API route (`src/app/api/.../route.ts`)
4. Client API function (`src/lib/api.ts`)
5. UI component / page
6. E2E test (`e2e/`)
7. Update seed data if demo narrative needs it (`db/seed.js` + `src/lib/demo-data.ts`)
8. Update docs (AGENTS.md, relevant rules/skills)

## Key files to read first

1. `src/lib/dal.ts` — how data is accessed (dual-mode: Postgres ↔ in-memory)
2. `src/lib/db.ts` — Neon serverless connection
3. `src/lib/ai/gateway.ts` — how AI calls work
4. `src/lib/auth/permissions.ts` — RBAC matrix
5. `src/lib/api.ts` — client ↔ API contract
6. `db/migrations/` — database schema
7. `e2e/helpers.ts` — E2E auth helpers and test user config
