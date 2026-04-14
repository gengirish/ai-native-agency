---
name: full-stack-sync
description: >-
  Keep AgencyOS features, code, database, seed data, tests, and documentation in sync.
  Use when adding features, changing schemas, updating the DAL, modifying API routes,
  or any change that touches multiple layers of the stack.
---

# Full-Stack Sync — AgencyOS

## When to use this skill

Invoke when any of these happen:

- Adding a new feature (new table, API route, page, or component)
- Changing a database schema (migration)
- Modifying the DAL (`src/lib/dal.ts`)
- Adding or changing API routes
- Updating demo/seed data
- Fixing bugs that span multiple layers

## The sync checklist

Every feature or change must keep **8 layers** in sync. Not every change touches all layers, but always verify which ones are affected.

### 1. Database migration

- File: `db/migrations/NNN_description.sql`
- Convention: Sequential numbering (e.g., `010_`, `011_`)
- Test: `npm run db:migrate`

### 2. DAL function (`src/lib/dal.ts`)

- Add both Postgres path (`if (hasDb())`) and in-memory fallback
- Use explicit `map*Row` functions for column mapping (snake_case → camelCase)
- **Never** use nested `sql` template fragments — use two-branch queries
- Money: cents in DB → dollars in return values
- UUIDs: cast with `::uuid`

### 3. API route (`src/app/api/.../route.ts`)

- Import from `@/lib/dal` only
- Follow shapes: `{ data }` for reads, created object for mutations
- Add auth check via `getUserFromRequest` if not public

### 4. Client API function (`src/lib/api.ts`)

- Add typed async function that calls the API route via `fetch`
- Use `fetchDataArray<T>` for list endpoints
- Use `authHeadersJson()` for mutation endpoints

### 5. TypeScript types (`src/types/index.ts`)

- Add or update interfaces
- Ensure DAL `map*Row` output matches the type

### 6. UI component / page

- Import data via `src/lib/api.ts` functions
- Use `"use client"` only when needed

### 7. Seed data (keep both sources in sync!)

| Source | Purpose |
|--------|---------|
| `db/seed.js` | Postgres seed — run with `npm run db:seed` |
| `src/lib/demo-data.ts` | In-memory fallback data |
| `src/lib/store.ts` | Store interface — add new collection |

When updating demo data, update **both** `db/seed.js` and `src/lib/demo-data.ts` to maintain the same narrative.

### 8. Tests and documentation

| What | Where |
|------|-------|
| E2E test | `e2e/*.spec.ts` — add test for new page/flow |
| E2E helpers | `e2e/helpers.ts` — update if auth or user data changes |
| AGENTS.md | Update code layout table, key tables list, commands |
| Rules | `.cursor/rules/*.mdc` — update if conventions change |
| Skills | `.cursor/skills/*/SKILL.md` — update if workflows change |
| YC product skill | Update if demo narrative changes |

## Quick-reference: adding a new entity

```
1. db/migrations/NNN_new_entity.sql          CREATE TABLE ...
2. src/types/index.ts                         export interface NewEntity { ... }
3. src/lib/store.ts                           Add to Store interface + createStore()
4. src/lib/demo-data.ts                       Add demo[Entity] array
5. src/lib/dal.ts                             getEntities(), createEntity(), mapEntityRow()
6. src/app/api/entities/route.ts              GET + POST handlers
7. src/lib/api.ts                             getEntities(), createEntity()
8. src/app/entities/page.tsx                  UI page
9. db/seed.js                                 Seed demo rows
10. e2e/entities.spec.ts                       E2E test
11. AGENTS.md                                  Update tables list
```

## Verification commands

```bash
npm run db:migrate          # Schema up to date
npm run db:seed             # Seed data matches schema
npm run build               # TypeScript compiles
npm run test:e2e            # All 55+ tests pass
```

## Common pitfalls

| Pitfall | Prevention |
|---------|------------|
| Nested sql template fragments | Use two-branch queries (see `project.mdc`) |
| demo-data.ts out of sync with seed.js | Update both when changing demo narrative |
| store.ts missing new collection | Add property to Store interface + createStore() |
| DAL returns wrong shape | Check map*Row output against TypeScript interface |
| API route imports store directly | Always import from `@/lib/dal` |
| E2E test uses old ID format | Use UUIDs matching `db/seed.js` constants |
| Missing auth on mutation route | Add `getUserFromRequest` check |
| Money as float instead of cents | Store cents in DB, divide by 100 in DAL |
