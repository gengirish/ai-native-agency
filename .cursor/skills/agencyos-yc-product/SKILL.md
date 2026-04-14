---
name: agencyos-yc-product
description: >-
  Maintains an investor-grade narrative and demo experience for AgencyOS (AI-native agency OS).
  Use when improving positioning, landing, demo data, API stubs, integrity of metrics copy,
  or scoping work toward a credible YC-style product story—not fake traction.
---

# AgencyOS — YC-caliber product discipline

## One-liner (use consistently)

**AgencyOS is the operating system for AI-native agencies** — one control plane from brief → AI production → expert QA → delivery → performance, with unit economics that look like software, not pure staffing.

## Architecture of the repo (do not conflate)

| Layer | Location | Role |
|--------|-----------|------|
| **Product UI** | `src/app`, `src/components`, `src/lib/api.ts` | Next.js 15 app; `api.ts` is the typed client boundary. |
| **Data Access Layer** | `src/lib/dal.ts`, `src/lib/db.ts` | Dual-mode: Neon Postgres when `DATABASE_URL` is set, in-memory store fallback. |
| **API Routes (31)** | `src/app/api/**/route.ts` | Auth, CRUD, AI generation, feedback translation, expert/publish mutations — all use DAL. |
| **Database** | `db/migrations/`, `db/seed.js` | 25+ Postgres tables, 9 migrations, idempotent seed script. |

When editing API routes, always import from `@/lib/dal`, never from `@/lib/store`.

## Demo vs production (integrity)

- **Dual-mode DAL:** When `DATABASE_URL` is set, all queries hit Neon Postgres. When unset, falls back to in-memory store with seeded demo data.
- **Demo seeding:** `npm run db:seed` populates Postgres with the same demo data. Demo accounts always work.
- **Honesty:** Landing and marketing must not claim live company KPIs unless backed by real data. Prefer "design targets," "product capabilities," or "demo workspace" language.

## Making the product *look* alive (investor demo)

- Keep demo data **internally consistent** (project IDs ↔ deliverables ↔ reviews ↔ pipelines).
- Preserve **one narrative arc** across Dashboard, Projects, CRM, AI Engine, Review Hub.
- Demo data lives in both `src/lib/demo-data.ts` (in-memory fallback) and `db/seed.js` (Postgres). Keep them in sync.

## Database architecture

- **DAL pattern:** Every API route imports from `src/lib/dal.ts`. The DAL checks `hasDb()` and either queries Postgres or reads the in-memory store.
- **Migrations:** Raw SQL in `db/migrations/`. Run with `npm run db:migrate`.
- **Seed:** `db/seed.js` inserts all demo data idempotently. Run with `npm run db:seed`.
- **Connection:** `src/lib/db.ts` uses `@neondatabase/serverless` for API routes (Edge-compatible). `db/connection.js` uses `pg` for CLI scripts.

## What YC still expects beyond UI

- Design partners, usage, retention, revenue or clear path to it.
- A crisp deck that matches what the product actually does—no metric without a source.
- The pitch deck is at `YC_PITCH_DECK.md`.

## Related skills

- **deploy-vercel** — ship the Next app.
- **playwright-e2e** — smoke tests including `BASE_URL` against staging/production.
