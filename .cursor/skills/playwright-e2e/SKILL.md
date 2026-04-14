---
name: playwright-e2e
description: >-
  Run and extend Playwright E2E tests for AgencyOS. Use when fixing flaky tests, adding flows,
  or running tests against a deployed URL via BASE_URL. Covers auth helpers and webServer config.
---

# Playwright E2E (AgencyOS)

## Current state

- **55 tests** across 5 spec files, all passing against live deployment
- Tests run against a real Neon Postgres database (not in-memory demo data)
- Auth uses seeded demo users with bcrypt-hashed passwords

## Commands

```bash
npm run test:e2e            # Run all tests locally
npm run test:e2e:ui         # Interactive UI mode
npm run test:e2e:live       # Run against deployed URL
```

Install browsers if needed: `npx playwright install chromium`

## Config (`playwright.config.ts`)

- **Tests:** `e2e/`
- **baseURL:** `process.env.BASE_URL` or `http://127.0.0.1:3000`
- **Local server:** If `BASE_URL` is **unset**, Playwright runs `npm run dev:e2e` (`next dev -H 127.0.0.1 -p 3000`) and waits for `http://127.0.0.1:3000` (long timeout for first compile).
- **Deployed / staging:** Set `BASE_URL` so **no** local `webServer` is started:

```bash
# Windows PowerShell
$env:BASE_URL="https://agencyos.intelliforge.tech"; npm run test:e2e
```

## Auth helper (`e2e/helpers.ts`)

- `loginAs(page, "admin" | "expert" | "client")` fills the login form with seeded credentials and waits for redirect to `/dashboard`.
- Uses email + password only — no hardcoded IDs or localStorage injection.
- `TestUser` objects have UUID IDs matching `db/seed.js` constants (e.g., `00000000-0000-0000-0000-000000000010` for admin).
- Default password in tests: `demo123` (must match seeded users).

## Test files

| File | Tests | What it covers |
|------|-------|----------------|
| `dashboard.spec.ts` | 4 | Dashboard heading, KPI cards, chart, projects |
| `features.spec.ts` | 7 | Review hub, brand DNA, expert dashboard, billing, CRM |
| `navigation.spec.ts` | 12 | 17 admin routes, sidebar, auth redirects |
| `projects.spec.ts` | 4 | Project list, brief builder wizard |
| `yc-features.spec.ts` | 28 | Analytics, autonomy, performance, feedback, publishing, benchmarks, SLA, AI engine, RBAC, login |

## Writing tests

- Auth: Always call `loginAs(page, role)` in `beforeEach` or at test start.
- Timeouts: Use generous timeouts (15-20s) for page loads — Neon cold starts can add latency.
- Assertions: Prefer flexible regexes over exact text matches for demo data.
- Data: Tests should work with both Postgres and in-memory data. Avoid asserting on specific UUIDs.

## Troubleshooting

| Issue | Approach |
|--------|-----------|
| `webServer` timeout | Start dev manually: `npm run dev:e2e`, then run tests with `BASE_URL=http://127.0.0.1:3000`. |
| Wrong host | Config uses `127.0.0.1`, not `localhost`, for consistency on Windows. |
| Flaky auth | Neon cold start can make login slow; increase `waitForURL` timeout. |
| Login timeout | Reduce workers (`--workers=2`) to avoid connection pool exhaustion. |
| Port in use | Kill existing process: `netstat -ano | findstr ":3000"` then `taskkill /PID <pid> /F`. |
