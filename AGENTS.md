# AGENTS.md — AgencyOS

This repository is **AgencyOS**, an AI-native agency operating system. Use this file as a fast orientation for AI coding agents.

## Product story

- **Positioning:** One control plane for briefs, brand DNA, AI pipelines, expert QA, billing, and performance — software-like economics for creative delivery.
- **Investor / demo:** Default workspace uses demo data unless `NEXT_PUBLIC_USE_DEMO_DATA=false`. Marketing must not fake company traction; see `.cursor/skills/agencyos-yc-product/SKILL.md`.

## Code layout

| Area | Path | Notes |
|------|------|--------|
| Next.js app | `src/app/`, `src/components/` | Primary product UI |
| Client API boundary | `src/lib/api.ts` | Typed stubs or future `fetch` to backend |
| Demo content | `src/lib/demo-data.ts` | Consistent narrative data for demos |
| Express API (optional) | `src/server.js`, `src/routes/`, `src/services/` | REST + Postgres per `ARCHITECTURE.md` |
| DB | `db/` | Migrations, connection — for API track |

## Cursor configuration

- **Rules:** `.cursor/rules/` — `project.mdc` (Express/Postgres), `api-routes.mdc`, `services.mdc`, `next-frontend.mdc` (Next/React).
- **Skills:** `.cursor/skills/` — project-local playbooks:
  - `agencyos-yc-product` — YC-caliber product discipline
  - `deploy-vercel` — ship Next.js to Vercel (incl. `--scope` when needed)
  - `playwright-e2e` — E2E + `BASE_URL`
  - `email-and-notifications` — Resend vs AgentMail overview
  - `identify-quality-resources` — NotebookLM / curriculum resource quality (code reviewer course)

## Related repos under `~/Documents` (context only)

Other folders may inform integrations (e.g. Next + Resend marketing sites, agency automation experiments) but **this repo’s source of truth is here**.

## Commands

```bash
npm install
npm run dev          # Turbopack dev
npm run dev:e2e      # Playwright-friendly dev server
npm run build && npm run start
npm run test:e2e     # set BASE_URL for deployed smoke tests
```

## Deploy

See `.cursor/skills/deploy-vercel/SKILL.md`. Use `vercel --prod --yes` and pass `--scope <team>` if the CLI requires it in non-interactive mode.
