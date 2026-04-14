# AI-Native Agency Platform (AgencyOS)

**AgencyOS** is the operating system for AI-native agencies: one control plane for briefs, brand DNA, AI production pipelines, expert QA, SLAs, billing, and performance — so teams ship client work at software-like margins instead of stacking disconnected tools.

The **Next.js app** under `src/app` is the investor-ready product surface (landing page + full app shell). The **Express API** under `src/server.js` and `src/routes` is the service layer described in [ARCHITECTURE.md](./ARCHITECTURE.md); wire it when you replace the typed client stubs in `src/lib/api.ts`.

## Quick Start — Product UI (Next.js)

**Prerequisites:** Node.js 18 or newer.

1. Install dependencies and copy env (demo data is on by default):

   ```bash
   npm install
   cp .env.example .env
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) — public landing; use **Get started** to register and explore a populated demo workspace. Set `NEXT_PUBLIC_USE_DEMO_DATA=false` in `.env` for empty API states while you integrate a real backend.

4. Production build:

   ```bash
   npm run build
   npm run start
   ```

## Quick Start — HTTP API (Express + Postgres)

Use this when you run the Node API and migrations (see `package.json` scripts if your fork wires `db:migrate`).

**Prerequisites**

- Node.js 18 or newer
- A PostgreSQL database ([Neon](https://neon.tech) or any Postgres with `DATABASE_URL` and SSL as required)

**Steps**

1. Install dependencies and configure `.env` (including `DATABASE_URL`).

2. Run migrations (when available in your branch):

   ```bash
   npm run db:migrate
   ```

3. Start the API server (see your `package.json`; default listen is often `PORT` / `3000`).

## Architecture

The platform is described as a **six-layer model** plus a **Human Expert** layer that runs alongside the AI engine: client experience, API gateway and authentication, core platform services, AI production, knowledge and data, and infrastructure, with experts handling review, refinement, and escalation. This repository implements the **HTTP API**, **middleware**, **services**, and **database** pieces; see [ARCHITECTURE.md](./ARCHITECTURE.md) for the full conceptual map and product layers.

## Project Structure

```text
src/
├── server.js                 Express app: global middleware, health check, route mounts, error handler
├── middleware/
│   ├── auth.js               Bearer JWT (or token) parsing; attaches req.user
│   ├── tenantIsolation.js    Ensures req.tenantId and tenant-safe access
│   └── errorHandler.js       Maps errors to HTTP responses
├── routes/                   One module per REST resource area; thin handlers, delegate to services
│   ├── analytics.js
│   ├── billing.js
│   ├── brands.js
│   ├── briefs.js
│   ├── deliverables.js
│   ├── experts.js
│   ├── feedback.js
│   ├── pipeline.js
│   ├── projects.js
│   └── templates.js
├── services/                 Business logic and all database access; AI gateway usage and cost logging
│   ├── aiGateway.js
│   ├── billingService.js
│   ├── brandService.js
│   ├── briefService.js
│   ├── clientFeedbackService.js
│   ├── deliverableService.js
│   ├── expertReviewService.js
│   ├── modelRouter.js
│   ├── pipelineOrchestrator.js
│   ├── projectService.js
│   ├── qaService.js
│   ├── qualityService.js
│   ├── taskDecomposer.js
│   ├── templateService.js
│   └── vectorStoreService.js
└── utils/
    └── errors.js             AppError, ValidationError, NotFoundError, ForbiddenError, ConflictError

db/
├── connection.js             pg Pool and query helper
├── migrate.js                Runs ordered SQL files from db/migrations/
├── reset.js                  Drops public tables (requires --yes); then re-run migrate
└── migrations/               Versioned .sql migrations
```

## API Endpoints

Base path for mounted routers is `/api`. Method and path are shown relative to each mount.

| Resource | Method | Path | Notes |
|----------|--------|------|--------|
| **Health** | GET | `/api/health` | DB connectivity check |
| **Projects** | GET | `/api/projects/stats` | Static route before `/:id` |
| | POST | `/api/projects` | Create |
| | GET | `/api/projects` | List |
| | GET | `/api/projects/:id` | Detail |
| | PATCH | `/api/projects/:id/status` | Status update |
| | PATCH | `/api/projects/:id/assign` | Assignment |
| **Briefs** | POST | `/api/briefs` | Create |
| | GET | `/api/briefs/:id` | Detail |
| | PUT | `/api/briefs/:id` | Update |
| | POST | `/api/briefs/:id/submit` | Submit |
| **Brands** | POST | `/api/brands/extract` | Extract (static before `/:id`) |
| | POST | `/api/brands` | Create |
| | GET | `/api/brands` | List |
| | GET | `/api/brands/:id/context` | Context |
| | GET | `/api/brands/:id/assets` | Assets |
| | DELETE | `/api/brands/:id/assets/:assetId` | Remove asset |
| | POST | `/api/brands/:id/assets` | Add asset |
| | GET | `/api/brands/:id` | Detail |
| | PUT | `/api/brands/:id` | Update |
| | DELETE | `/api/brands/:id` | Delete |
| **Deliverables** | POST | `/api/deliverables` | Create |
| | GET | `/api/deliverables/project/:projectId/history` | History |
| | GET | `/api/deliverables/project/:projectId` | By project |
| | PATCH | `/api/deliverables/:id/status` | Status |
| | POST | `/api/deliverables/:id/version` | New version |
| | GET | `/api/deliverables/:id` | Detail |
| **Billing** | GET | `/api/billing/balance` | Balance |
| | POST | `/api/billing/balance/initialize` | Admin |
| | POST | `/api/billing/credits/add` | Admin |
| | POST | `/api/billing/invoices` | Create invoice |
| | GET | `/api/billing/invoices` | List invoices |
| | PATCH | `/api/billing/invoices/:id/status` | Invoice status |
| **Experts** | GET | `/api/experts/reviews/pending` | Pending reviews |
| | GET | `/api/experts/reviews/mine` | Current user’s reviews |
| | POST | `/api/experts/reviews` | Create review |
| | GET | `/api/experts/reviews/:id` | Review detail |
| | POST | `/api/experts/reviews/:id/claim` | Claim |
| | POST | `/api/experts/reviews/:id/approve` | Approve |
| | POST | `/api/experts/reviews/:id/revise` | Request revision |
| | POST | `/api/experts/reviews/:id/escalate` | Escalate |
| | GET | `/api/experts/workload` | Workload |
| | POST | `/api/experts/auto-assign` | Auto-assign |
| | GET | `/api/experts/performance` | Performance |
| | GET | `/api/experts/leaderboard` | Leaderboard |
| **Pipeline** | POST | `/api/pipeline/run` | Run pipeline |
| | GET | `/api/pipeline/project/:projectId` | By project |
| | GET | `/api/pipeline/:id` | Run detail |
| | POST | `/api/pipeline/:id/retry` | Retry |
| **Templates** | POST | `/api/templates` | Create (auth) |
| | GET | `/api/templates/defaults` | Defaults |
| | GET | `/api/templates/best/:projectType` | Best for type |
| | GET | `/api/templates` | List |
| | GET | `/api/templates/:id` | Detail |
| | PUT | `/api/templates/:id` | Update (auth) |
| **Analytics** | GET | `/api/analytics/quality/project/:projectId` | Quality by project |
| | GET | `/api/analytics/quality/trends` | Quality trends |
| | GET | `/api/analytics/experts/performance/:expertId` | Expert performance |
| | GET | `/api/analytics/experts/top` | Top experts |
| | GET | `/api/analytics/costs/summary` | AI cost summary |
| | GET | `/api/analytics/revenue/summary` | Revenue summary |
| **Feedback** | POST | `/api/feedback` | Submit feedback |
| | GET | `/api/feedback/deliverable/:deliverableId` | By deliverable |
| | GET | `/api/feedback/project/:projectId` | By project |
| | GET | `/api/feedback/project/:projectId/revisions` | Revisions |
| | GET | `/api/feedback/project/:projectId/approved` | Approved |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (SSL as needed for Neon) |
| `NODE_ENV` | Recommended | `development` or `production` |
| `PORT` | No | HTTP port (default `3000`) |
| `OPENAI_API_KEY` | For OpenAI | Used by `aiGateway` for OpenAI calls |
| `ANTHROPIC_API_KEY` | For Anthropic | Used by `aiGateway` for Anthropic calls |

Never commit `.env`. Copy from `.env.example` and keep secrets local or in your deployment environment.

## Database

- **Migrate:** `npm run db:migrate` runs SQL files in `db/migrations/` in filename order and records them in `schema_migrations`.
- **Reset (destructive):** `npm run db:reset -- --yes` drops all tables in `public`. Then run `npm run db:migrate` to rebuild.
- **New migration:** Add a new `.sql` file under `db/migrations/` with a sortable name (e.g. `002_add_feature.sql`). Follow the team order: migration first, then service, then route, then tests.

## Development

| Script | Command | Purpose |
|--------|---------|---------|
| Dev (watch) | `npm run dev` | Turbopack dev server |
| Dev (E2E) | `npm run dev:e2e` | Playwright-friendly dev server |
| Build | `npm run build` | Production build |
| Start | `npm run start` | Run production build |
| E2E tests | `npm run test:e2e` | Run Playwright test suite |
| Migrate | `npm run db:migrate` | Apply pending migrations |
| Reset | `npm run db:reset -- --yes` | Drop all public tables |

## Testing

- **E2E tests (Playwright):** `npm run test:e2e` — 65 tests covering all 17 routes, sidebar navigation, dashboard, brief builder, core features, and YC features. Set `BASE_URL` for deployed smoke tests. See `.cursor/skills/playwright-e2e/SKILL.md`.
- **Unit tests:** Not yet wired in `package.json`. When added, the intended command is `npm test`.

## Cursor Skills Library

This project includes 148 agent skills in `.cursor/skills/`. These are playbooks covering deployment, testing, frontend, backend, security, AI, business strategy, and more. See `AGENTS.md` for the full categorized inventory. To use a skill, read its `SKILL.md` before starting work in that domain.

## Contributing

- **Branches:** Use short, descriptive names (e.g. `feature/billing-credits`, `fix/tenant-scope-deliverables`).
- **Commits:** Prefer imperative, present-tense subjects with enough body context when behavior changes (what and why, not implementation trivia).

## License

MIT
