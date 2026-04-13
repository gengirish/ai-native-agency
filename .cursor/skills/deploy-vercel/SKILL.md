---
name: deploy-vercel
description: >-
  Deploy this Next.js app to Vercel using the Vercel CLI. Use when the user asks to deploy,
  ship to production, publish a preview, set env vars, domains, or rollback. Covers non-interactive
  deploys when a team scope is required.
---

# Deploy AgencyOS (Next.js) to Vercel

## Prerequisites

- Vercel CLI: `npm install -g vercel` or `npx vercel`
- Authenticated: `vercel login`
- Valid `package.json` with `build` and `start`

## Production deploy

```bash
vercel --prod --yes
```

First run may create `.vercel/` (gitignored). Use `--yes` to accept detected framework settings.

### Non-interactive: team / scope required

If the CLI errors with `missing_scope` or `action_required`, pass your team scope explicitly (see `vercel teams ls` or the error’s `choices`):

```bash
vercel --prod --yes --scope <your-team-slug>
```

Or link once, then deploy without `--scope`:

```bash
vercel link --yes --scope <your-team-slug>
vercel --prod --yes
```

## Preview deploy

```bash
vercel --yes
```

## Environment variables

```bash
vercel env add VARIABLE_NAME production
vercel env ls
vercel env pull .env.local
```

For this repo, common public vars:

- `NEXT_PUBLIC_USE_DEMO_DATA` — set `false` in production when the real API is wired; omit or `true` for demo workspaces.

## Post-deploy checks

- Open the production URL; confirm `/` shows the landing and `/login` works.
- Optional smoke E2E against the live URL:

```bash
set BASE_URL=https://your-deployment.vercel.app
npm run test:e2e
```

(`playwright.config.ts` skips starting a local server when `BASE_URL` is set.)

## Rollback & logs

```bash
vercel rollback
vercel inspect <deployment-url> --logs
```

## Next.js on Vercel

- Framework is auto-detected; no `output: "standalone"` required for standard Next on Vercel.
- Ensure Node version matches local if builds differ: `engines` in `package.json` if needed.
