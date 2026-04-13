---
name: playwright-e2e
description: >-
  Run and extend Playwright E2E tests for AgencyOS. Use when fixing flaky tests, adding flows,
  or running tests against a deployed URL via BASE_URL. Covers auth helpers and webServer config.
---

# Playwright E2E (AgencyOS)

## Commands

```bash
npm run test:e2e
npm run test:e2e:ui
```

Install browsers if needed: `npx playwright install chromium`

## Config (`playwright.config.ts`)

- **Tests:** `e2e/`
- **baseURL:** `process.env.BASE_URL` or `http://127.0.0.1:3000`
- **Local server:** If `BASE_URL` is **unset**, Playwright runs `npm run dev:e2e` (`next dev -H 127.0.0.1 -p 3000`) and waits for `http://127.0.0.1:3000` (long timeout for first compile).
- **Deployed / staging:** Set `BASE_URL` so **no** local `webServer` is started:

```bash
# Windows PowerShell
$env:BASE_URL="https://your-app.vercel.app"; npm run test:e2e
```

## Auth helper (`e2e/helpers.ts`)

- `loginAs(page, "admin" | "expert" | "client")` seeds `localStorage` (`agencyos_auth`, users, passwords) and opens `/dashboard`.
- Default password in tests: `test1234` (must match seeded users).

## Writing tests

- Unauthenticated `/` shows the **public landing** (not an immediate redirect to `/login`).
- Authenticated users hitting `/` should end on `/dashboard` after redirect.
- When demo data is on, assertions may see real project names (e.g. Lumen, Pulse); prefer flexible regexes.

## Troubleshooting

| Issue | Approach |
|--------|-----------|
| `webServer` timeout | Start dev manually: `npm run dev:e2e`, then run tests with `BASE_URL=http://127.0.0.1:3000`. |
| Wrong host | Config uses `127.0.0.1`, not `localhost`, for consistency on Windows. |
| Flaky auth | Ensure `waitForSelector` for sidebar / `AgencyOS` after `loginAs`. |
