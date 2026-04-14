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
- **Skills:** `.cursor/skills/` — 148 playbooks available. Read the relevant `SKILL.md` before starting work in that domain.

### AgencyOS Core

| Skill | Purpose |
|-------|---------|
| `agencyos-yc-product` | YC-caliber product discipline and demo integrity |
| `email-and-notifications` | Resend vs AgentMail for transactional / agent email |
| `agentmail-integration` | Programmatic inbox integration |
| `identify-quality-resources` | NotebookLM / curriculum resource quality |

### Deployment & DevOps

| Skill | Purpose |
|-------|---------|
| `deploy-vercel` | Ship Next.js to Vercel (incl. `--scope`) |
| `deploy-flyio` | Deploy to Fly.io |
| `devops-deploy` | General deployment patterns |
| `cloud-architect` | Cloud architecture design |
| `cloud-devops` | Cloud DevOps practices |
| `docker-expert` | Docker containerization |
| `dockerise-java-repo` | Dockerize Java projects |
| `helm-chart-scaffolding` | Kubernetes Helm charts |
| `kubernetes-deployment` | K8s deployment patterns |
| `k8s-security-policies` | Kubernetes security policies |
| `github-actions-templates` | CI/CD with GitHub Actions |
| `gha-security-review` | GitHub Actions security review |

### Testing & QA

| Skill | Purpose |
|-------|---------|
| `playwright-e2e` | Playwright E2E tests + `BASE_URL` |
| `webapp-testing` | Web application testing |
| `e2e-testing-patterns` | End-to-end testing patterns |
| `testing-patterns` | General testing strategies |
| `python-testing-patterns` | Python test patterns |
| `temporal-python-testing` | Temporal workflow testing |
| `k6-load-testing` | Load/performance testing with k6 |
| `unit-test-coverage` | Unit test coverage improvement |
| `beta-testing-infra` | Beta testing infrastructure |
| `production-code-audit` | Production code quality audit |

### Frontend & Design

| Skill | Purpose |
|-------|---------|
| `react-nextjs-development` | React + Next.js patterns |
| `nextjs-app-router-patterns` | Next.js App Router patterns |
| `nextjs-best-practices` | Next.js best practices |
| `shadcn` | shadcn/ui component library |
| `tailwind-patterns` | Tailwind CSS patterns |
| `tailwind-design-system` | Tailwind design system |
| `frontend-design` | Frontend design principles |
| `frontend-ui-dark-ts` | Dark-themed TypeScript UI |
| `landing-page-generator` | Landing page creation |
| `canvas-design` | Canvas-based design |
| `brand-guidelines` | Brand guideline systems |
| `theme-factory` | Theme generation |
| `web-artifacts-builder` | Web artifact creation |
| `signup-flow-cro` | Signup flow conversion optimization |
| `kpi-dashboard-design` | KPI dashboard design |

### Backend & Architecture

| Skill | Purpose |
|-------|---------|
| `architecture` | System architecture |
| `software-architecture` | Software architecture patterns |
| `domain-driven-design` | DDD patterns |
| `cqrs-implementation` | CQRS implementation |
| `saga-orchestration` | Saga orchestration patterns |
| `event-sourcing-architect` | Event sourcing architecture |
| `workflow-orchestration-patterns` | Workflow orchestration |
| `error-handling-patterns` | Error handling strategies |
| `saas-multi-tenant` | Multi-tenant SaaS patterns |
| `bullmq-specialist` | BullMQ job queue |
| `postgresql` | PostgreSQL usage |
| `postgresql-optimization` | PostgreSQL performance tuning |

### Python & FastAPI

| Skill | Purpose |
|-------|---------|
| `fastapi-pro` | FastAPI expert patterns |
| `fastapi-router-py` | FastAPI router patterns |
| `fastapi-templates` | FastAPI project templates |
| `flask-api-patterns` | Flask API patterns |
| `python-fastapi-development` | Python + FastAPI development |
| `pydantic-models-py` | Pydantic model patterns |
| `pydantic-ai` | Pydantic AI integration |

### Security

| Skill | Purpose |
|-------|---------|
| `api-security-best-practices` | API security best practices |
| `api-security-testing` | API security testing |
| `api-fuzzing-bug-bounty` | API fuzzing and bug bounty |
| `broken-authentication` | Auth vulnerability patterns |
| `security-scanning-security-hardening` | Security scanning and hardening |
| `red-team-tactics` | Red team tactics |
| `cc-skill-security-review` | Security review |
| `harden-webhook-endpoint` | Webhook endpoint hardening |
| `review-privacy-boundary` | Privacy boundary review |

### AI & Prompt Engineering

| Skill | Purpose |
|-------|---------|
| `ai-engineer` | AI engineering practices |
| `ai-agent-development` | AI agent development |
| `claude-api` | Claude API usage |
| `prompt-engineering` | Prompt engineering techniques |
| `advanced-evaluation` | Advanced model evaluation |
| `agent-evaluation` | AI agent evaluation |
| `bdistill-behavioral-xray` | Behavioral analysis |

### API & Documentation

| Skill | Purpose |
|-------|---------|
| `api-documentation` | API documentation |
| `api-documenter` | API doc generation |
| `openapi-spec-generation` | OpenAPI spec generation |
| `doc-sync` | Documentation sync |
| `doc-coauthoring` | Document co-authoring |

### Business & Strategy

| Skill | Purpose |
|-------|---------|
| `startup-analyst` | Startup analysis |
| `startup-metrics-framework` | Startup metrics framework |
| `investor-materials` | Investor deck/materials |
| `market-research` | Market research |
| `competitive-landscape` | Competitive analysis |
| `pricing-strategy` | Pricing strategy |
| `monetization` | Monetization patterns |
| `launch-strategy` | Product launch strategy |
| `content-strategy` | Content strategy |
| `copywriting` | Copywriting |
| `seo-mastery` | SEO optimization |
| `micro-saas-launcher` | Micro-SaaS launch playbook |

### Billing & Payments

| Skill | Purpose |
|-------|---------|
| `payment-integration` | Payment integration |
| `lemonsqueezy-payments` | LemonSqueezy payments |
| `clerk-auth` | Clerk authentication |

### Document & Media Generation

| Skill | Purpose |
|-------|---------|
| `pdf` | PDF generation |
| `pdf-official` | Official PDF generation |
| `docx` | DOCX generation |
| `pptx` | PPTX generation |
| `xlsx` | XLSX generation |
| `algorithmic-art` | Algorithmic art generation |
| `slack-gif-creator` | Slack GIF creation |

### Cursor Agent Tooling

| Skill | Purpose |
|-------|---------|
| `create-skill` | Create new Cursor skills |
| `create-rule` | Create Cursor rules |
| `create-hook` | Create Cursor hooks |
| `create-subagent` | Create Cursor subagents |
| `skill-creator` | Skill authoring guide |
| `migrate-to-skills` | Migrate to skills format |
| `babysit` | Keep a PR merge-ready |
| `canvas` | Canvas interactions |
| `cursor-blame` | Cursor blame utility |
| `shell` | Shell command patterns |
| `statusline` | CLI status line config |
| `update-cli-config` | Update CLI config |
| `update-cursor-settings` | Update Cursor settings |

### Project-Specific (imported for reference)

| Skill | Purpose |
|-------|---------|
| `interviewbot-*` (10 skills) | InterviewBot project: backend, frontend, billing, database, deploy, testing, agentmail, AI engine, realtime, project |
| `facilityos-*` (7 skills) | FacilityOS project: billing, database, deploy, frontend, notifications, project, testing |
| `hrms-*` (4 skills) | HRMS project: billing, forms, TanStack Query, Zustand |
| `mai-safety-ops` | MAI safety operations |
| `akf-trust-metadata` | AKF trust metadata |
| `log4j-migration` | Log4j migration |
| `007` | Special ops |
| `add-legal-skill` | Legal skill template |
| `generate-audit-metadata` | Audit metadata generation |
| `architect-review` | Architecture review |
| `internal-comms` | Internal communications |
| `amazon-shopping` | Amazon shopping automation |
| `mcp-builder` | MCP server builder |
| `template` | Skill template |

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
