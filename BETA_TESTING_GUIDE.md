# AgencyOS — Beta Testing Guide

> **Live URL:** [agencyos.intelliforge.tech](https://agencyos.intelliforge.tech)

This guide walks you through every testable flow in AgencyOS, from account creation to the final delivery pipeline. Follow it end-to-end or jump to the section for the role you want to test.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Flow A — Client Journey](#2-flow-a--client-journey)
3. [Flow B — Expert Journey](#3-flow-b--expert-journey)
4. [Flow C — Admin Journey](#4-flow-c--admin-journey)
5. [Cross-Role Scenarios](#5-cross-role-scenarios)
6. [Known Limitations](#6-known-limitations)

---

## 1. Getting Started

### Option A: Create a new account

1. Open the app and click **Sign In** (or navigate to `/login`).
2. Click the **Register** tab.
3. Fill in **Name**, **Email**, and **Password** (minimum 8 characters).
4. Select a role (note: the server always assigns **client** regardless of selection — this is intentional for security).
5. Click **Create Account**.
6. You are redirected to `/dashboard`.

### Option B: Use a seeded demo account

The login page has **Instant Demo Access** buttons for quick entry. You can also sign in manually with these credentials:

| Email | Password | Role | Name |
|-------|----------|------|------|
| `admin@agencyos.demo` | `demo123` | Admin | Priya Kapoor |
| `maya@agencyos.demo` | `demo123` | Expert | Maya Okonkwo |
| `jordan@agencyos.demo` | `demo123` | Expert | Jordan Lee |
| `sarah@agencyos.demo` | `demo123` | Client | Sarah Chen |

### Verify login

After signing in, confirm:
- [ ] You land on `/dashboard`
- [ ] The sidebar shows your **name** and **role** at the bottom
- [ ] KPI cards load (Total Revenue, Active Projects, etc.)

---

## 2. Flow A — Client Journey

> **Login as:** `sarah@agencyos.demo` / `demo123` (or any client account)

### Step 1: Explore the Dashboard

1. Navigate to `/dashboard`.
2. Verify you see:
   - [ ] KPI cards (revenue, projects, margin, quality score)
   - [ ] Revenue chart (or empty state)
   - [ ] Active projects table
   - [ ] Activity feed

### Step 2: Browse Existing Projects

1. Click **Projects** in the sidebar.
2. Verify the project list loads with seeded projects (Lumen Analytics, Pulse Health, etc.).
3. Try the filter tabs: **All**, **Active**, **Completed**, **Draft**.
4. Use the search bar to filter by project name.
5. Click **View AI Output** on any project that has deliverables.

### Step 3: Create a New Brief (Full AI Generation Flow)

This is the core client workflow — creating a project brief that triggers AI content generation.

1. From `/projects`, click **New Brief** (or navigate to `/projects/new`).
2. **Step 1 — Project Type:** Select a type (e.g., Brand Identity, Social Media, Ad Creative, Logo Design, Email Campaign, Marketing Collateral).
3. **Step 2 — Details:** Fill in:
   - Project title
   - Description
   - Budget (in dollars)
   - Deadline
4. **Step 3 — Brand Assets:** Review loaded brand profiles (if any). Select relevant brand DNA.
5. **Step 4 — Deliverables:** Toggle which deliverable types you want and set quantities.
6. **Step 5 — Review:** Confirm the brief summary, then click **Submit**.
7. **What happens next:**
   - The system creates the project in `draft` status.
   - It triggers AI generation (`POST /api/generate`).
   - The project moves to `ai_generating` → `qa_check`.
   - You are redirected to `/projects/[id]/generated`.
8. On the generated output page, verify:
   - [ ] Success banner appears
   - [ ] Model info shows (provider, model name, latency, tokens, cost)
   - [ ] AI-generated content renders in markdown format
   - [ ] Content is relevant to the project type you chose

### Step 4: View Brand DNA

1. Click **Brand** in the sidebar.
2. Browse brand profiles, colors, typography, and tone of voice.
3. This is read-only for clients.

### Step 5: Use the Feedback Copilot

1. Click **Feedback** in the sidebar.
2. In the **Live Translation Demo** section:
   - Type natural-language client feedback (e.g., "Make it pop more, the colors feel dull").
   - Click **Translate**.
   - Verify the AI returns structured, actionable items (technical direction, priority, sentiment).
3. Browse the **Feedback History** section for previously translated feedback.

### Step 6: Check Billing

1. Click **Billing** in the sidebar.
2. Browse the tabs:
   - **Pricing Plans** — compare tiers
   - **Credit Packs** — view available credit bundles
   - **Invoices** — check invoice history
   - **Usage** — review consumption data

### Client — Restricted Access Test

Verify that as a client you **cannot** access admin/expert pages:
- [ ] Navigate to `/analytics` — should show "Access Restricted"
- [ ] Navigate to `/crm` — should show "Access Restricted"
- [ ] Navigate to `/review` — should show "Access Restricted"
- [ ] The sidebar does **not** show links for Review, CRM, Analytics, Autonomy, AI Engine, Publishing, Benchmarks, SLA

---

## 3. Flow B — Expert Journey

> **Login as:** `maya@agencyos.demo` / `demo123`

### Step 1: Dashboard Overview

1. Navigate to `/dashboard`.
2. Verify KPIs and projects load (same dashboard, but sidebar shows expert-relevant links only).

### Step 2: Review Hub (QA Workflow)

1. Click **Review** in the sidebar.
2. The Review Hub shows a filterable queue of items pending QA:
   - Filter: **All** / **Pending** / **Approved** / **Revision Requested**
3. Select a review item from the queue.
4. In the detail panel:
   - [ ] Read the AI-generated content
   - [ ] Set a **star rating** (1–5)
   - [ ] Add a **comment** in the thread
   - [ ] Click **Approve**, **Request Revision**, or **Reject**
5. Verify the review status updates in the queue.

### Step 3: Expert Queue (Assignment Management)

1. Click **Expert** in the sidebar.
2. You see your assignment queue with stats (items reviewed, avg time, quality score).
3. Test the following actions:
   - **Claim** a queued assignment (moves it to `in_review`)
   - **Complete Review** on a claimed assignment (updates quality score and completion time)
   - If an item has status `escalated`, click **Escalate to Senior** (sets escalation level to `manual_required`)
4. Verify the assignment list updates after each action.

### Step 4: Browse Projects (Read-Only)

1. Click **Projects** in the sidebar.
2. Verify you can see the project list but there is **no "New Brief"** button (experts cannot create projects).

### Step 5: Performance Metrics

1. Click **Performance** in the sidebar.
2. Review channel performance, ROI leaderboard, deliverable table, and AI vs. Traditional comparison card.

### Step 6: Feedback Copilot

1. Click **Feedback** in the sidebar.
2. Test the translation feature same as the client flow above.

### Expert — Restricted Access Test

Verify restricted areas:
- [ ] Navigate to `/crm` — should show "Access Restricted"
- [ ] Navigate to `/analytics` — should show "Access Restricted"
- [ ] Navigate to `/publishing` — should show "Access Restricted"
- [ ] Sidebar does **not** show CRM, Analytics, Autonomy, AI Engine, Publishing, Benchmarks, SLA, Billing

---

## 4. Flow C — Admin Journey

> **Login as:** `admin@agencyos.demo` / `demo123`

The admin has access to **everything**. Follow the client and expert flows above, plus these admin-only areas:

### Step 1: CRM & Sales Pipeline

1. Click **CRM** in the sidebar.
2. View the pipeline stats (total leads, pipeline value, conversion rate).
3. Browse the **Kanban board** — drag or click to view lead details.
4. **Speculative Work Generator:**
   - Select a lead
   - Optionally enter a website URL
   - Click **Generate Speculative Sample**
   - This creates a `brand_identity` project, runs AI generation, and links the output to the lead
   - Verify the lead now shows a speculative work URL

### Step 2: Analytics Dashboard

1. Click **Analytics** in the sidebar.
2. Verify:
   - [ ] Revenue and margin KPIs
   - [ ] Cost breakdown charts
   - [ ] Project type mix
   - [ ] Client revenue table

### Step 3: Autonomy Escalation Engine

1. Click **Autonomy** in the sidebar.
2. Review:
   - [ ] Autonomy stats (autonomous rate, escalation count)
   - [ ] Autonomy lanes by level (full_auto, spot_check, human_required, etc.)
   - [ ] Trend chart and cost savings narrative

### Step 4: AI Production Engine

1. Click **AI Engine** in the sidebar.
2. Verify:
   - [ ] Pipeline KPIs (active pipelines, success rate, avg latency)
   - [ ] Active pipeline list with tasks
   - [ ] Model registry showing available AI models
   - [ ] Cost tracking chart

### Step 5: Publishing

1. Click **Publishing** in the sidebar.
2. Review the channel configuration and publishing queue.
3. Test actions:
   - Select a publishing job → click **Publish Now** (sets status to `live`)
   - Select a job → click **Schedule** and pick a date/time
   - Use the **Quick Publish** panel for instant publishing
4. Verify job statuses update in the queue.

### Step 6: Proactive Creative Director

1. Click **Proactive** in the sidebar.
2. Browse AI-generated creative suggestions.
3. Test:
   - **Accept** a suggestion (UI updates with progress simulation)
   - **Dismiss** a suggestion
   - Use filter controls to narrow suggestion types

### Step 7: Benchmarks

1. Click **Benchmarks** in the sidebar.
2. Review:
   - [ ] Percentile scorecard
   - [ ] Category breakdowns (quality, speed, cost, etc.)
   - [ ] Radar chart comparison
   - [ ] Competitive moat insights

### Step 8: SLA Management

1. Click **SLA** in the sidebar.
2. Review:
   - [ ] SLA tiers and their parameters
   - [ ] Compliance tracking
   - [ ] Guarantee details
   - [ ] Breach timeline (if any)

---

## 5. Cross-Role Scenarios

These scenarios test the full handoff flow between roles.

### Scenario 1: Brief → Generation → Review → Delivery

| Step | Who | Action |
|------|-----|--------|
| 1 | **Client** (Sarah) | Create a new brief at `/projects/new` — choose "Social Media", fill details, submit |
| 2 | **System** | AI generates content; project moves to `qa_check` |
| 3 | **Client** (Sarah) | View generated output at `/projects/[id]/generated` |
| 4 | **Expert** (Maya) | Log in → go to `/review` → find the new review item in the queue |
| 5 | **Expert** (Maya) | Read the AI output, rate it 4 stars, add a comment "Tone is on-brand, approve" |
| 6 | **Expert** (Maya) | Click **Approve** |
| 7 | **Admin** (Priya) | Log in → `/dashboard` → verify project status updated, quality score reflected |

### Scenario 2: Review Rejection → Expert Escalation

| Step | Who | Action |
|------|-----|--------|
| 1 | **Expert** (Maya) | Go to `/review`, select a review, click **Reject** |
| 2 | **Expert** (Maya) | Go to `/expert`, find the escalated assignment |
| 3 | **Expert** (Maya) | Click **Escalate to Senior** |
| 4 | **Admin** (Priya) | Verify escalation reflected in `/autonomy` stats |

### Scenario 3: CRM Lead → Speculative Work

| Step | Who | Action |
|------|-----|--------|
| 1 | **Admin** (Priya) | Go to `/crm`, select a lead |
| 2 | **Admin** (Priya) | Click **Generate Speculative Sample**, provide a URL |
| 3 | **System** | AI generates brand identity content |
| 4 | **Admin** (Priya) | Verify the lead now links to the generated speculative work |

---

## 6. Known Limitations

| Area | Note |
|------|------|
| **Registration** | All self-registered users get `client` role regardless of selection. Admin/expert accounts must be seeded or created via DB. |
| **AI generation** | Requires API keys (`OPENROUTER_API_KEY`, `GROQ_API_KEY`, or `GEMINI_API_KEY`). Without keys, deterministic demo content is returned. |
| **Feedback translation** | Same as above — uses AI gateway with fallback to demo translation. |
| **Publishing** | Status changes are persisted but actual publishing to external channels is simulated. |
| **Proactive suggestions** | Accept/dismiss actions are local UI state only — not persisted to the server. |
| **Billing** | Displays seeded/demo data. No real payment processing is connected. |
| **Data resets** | On Vercel cold starts (serverless), in-memory data resets if running without `DATABASE_URL`. With Postgres, data persists. |

---

## Bug Reporting

When reporting issues, please include:
1. **Account used** (email + role)
2. **URL** where the issue occurred
3. **Steps to reproduce** (be specific)
4. **Expected vs. actual behavior**
5. **Screenshots** (if visual)
6. **Browser + OS** (e.g., Chrome 125 / Windows 11)

Submit reports to the project repository issues page or your designated feedback channel.
