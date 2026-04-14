# AGENTS.md — AgencyOS

Quick orientation for AI coding agents working in this repository.

## What this is

**AgencyOS** — an AI-native agency operating system built with Next.js 15 (App Router), React 19, Tailwind CSS, and TypeScript. Deployed on Vercel.

**Live:** [agencyos.intelliforge.tech](https://agencyos.intelliforge.tech)

## Product story

- **Positioning:** One control plane for briefs, brand DNA, AI pipelines, expert QA, billing, and performance — software-like economics for creative delivery.
- **Demo mode:** 4 seeded users, 6 projects, full data narrative. One-click login on `/login`. Marketing must not fake traction; see `.cursor/skills/agencyos-yc-product/SKILL.md`.

## Code layout

| Area | Path | Notes |
|------|------|-------|
| Pages (17 routes) | `src/app/*/page.tsx` | Dashboard, projects, CRM, reviews, etc. |
| API routes (28) | `src/app/api/**/route.ts` | Auth, CRUD, AI generation |
| Components | `src/components/` | Brief wizard, review hub, layout, UI |
| Client API layer | `src/lib/api.ts` | All `fetch()` calls to API routes |
| AI gateway | `src/lib/ai/gateway.ts` | OpenRouter → Groq → Gemini failover |
| Auth (JWT) | `src/lib/auth/` | `jwt.ts`, `context.tsx`, `permissions.ts` |
| Demo data | `src/lib/demo-data.ts` | Seeded projects, users, reviews, etc. |
| In-memory store | `src/lib/store.ts` | `globalThis` store, resets on cold start |
| Types | `src/types/index.ts` | 40+ interfaces |
| Middleware | `src/middleware.ts` | Cookie-based JWT gate |

## Auth system

Custom JWT (no NextAuth). Token flows:

1. `POST /api/auth/login` → returns `{ user, token }`
2. Client stores token in `localStorage` + cookie (`agencyos_token`)
3. API calls use `Authorization: Bearer <token>`
4. Middleware checks cookie, redirects to `/login` if missing
5. 3 roles: `admin` (full access), `expert` (review/QA), `client` (projects/billing)

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

Keys in `.env` (local) and Vercel env vars (production). Never committed.

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
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:live    # E2E against deployed URL
```

## Deploy

```bash
npx vercel --prod --yes --scope girish-hiremaths-projects
```

## Key files to read first

1. `src/lib/store.ts` — how data is managed
2. `src/lib/ai/gateway.ts` — how AI calls work
3. `src/lib/auth/permissions.ts` — RBAC matrix
4. `src/lib/demo-data.ts` — what the demo shows
5. `src/lib/api.ts` — client ↔ API contract
