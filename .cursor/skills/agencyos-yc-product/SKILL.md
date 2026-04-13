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
| **Product UI** | `src/app`, `src/components`, `src/lib/api.ts` | Next.js 15 app; `api.ts` is the typed client boundary (demo or future `fetch`). |
| **Backend API** (optional / parallel) | `src/server.js`, `src/routes`, `src/services`, `db/` | Express + Postgres per `ARCHITECTURE.md` and `.cursor/rules/project.mdc`. |

When editing the **Next app**, follow frontend patterns and `src/lib/api.ts`. When editing **Express**, follow `project.mdc` and `api-routes.mdc`.

## Demo vs production (integrity)

- **Demo dataset:** `src/lib/demo-data.ts`. Served when `NEXT_PUBLIC_USE_DEMO_DATA` is not `false`.
- **Honesty:** Landing and marketing must not claim live company KPIs unless backed by real data. Prefer “design targets,” “product capabilities,” or “demo workspace” language.
- **Turning off demo:** Set `NEXT_PUBLIC_USE_DEMO_DATA=false` to exercise empty states while wiring a real backend.

## Making the product *look* alive (investor demo)

- Keep demo data **internally consistent** (project IDs ↔ deliverables ↔ reviews ↔ pipelines).
- Preserve **one narrative arc** across Dashboard, Projects, CRM, AI Engine, Review Hub.
- Avoid empty dashboards in default demo mode unless intentionally testing integration.

## API wiring path (credible milestone)

1. Replace stubs in `src/lib/api.ts` with `fetch` to your API (Bearer auth, tenant header as designed).
2. Align response shapes with `src/types`.
3. Run Express services with real migrations (`db/migrations/`).
4. Feature order for backend: migration → service → route → tests (see `project.mdc`).

## What YC still expects beyond UI

- Design partners, usage, retention, revenue or clear path to it.
- A crisp deck that matches what the product actually does—no metric without a source.

## Related skills

- **deploy-vercel** — ship the Next app.
- **playwright-e2e** — smoke tests including `BASE_URL` against staging/production.
