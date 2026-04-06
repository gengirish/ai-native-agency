# AgencyOS — Beta Testing Plan

> **Production URL:** https://ai-native-agency.fly.dev/
> **Repo:** https://github.com/gengirish/ai-native-agency
> **Platform:** Fly.io (Next.js standalone)
> **E2E Baseline:** 65/65 tests passing

---

## 1. Beta Objectives

| Objective | Success Criteria |
|-----------|-----------------|
| Validate that all 16 features render correctly across devices and browsers | Zero critical rendering bugs across Chrome, Firefox, Safari, mobile |
| Stress-test navigation and interactivity | All sidebar links resolve, tab switching works, forms accept input without errors |
| Gather UX feedback on information density, layout, and flow | Structured feedback from 5–10 testers with actionable improvement list |
| Identify performance bottlenecks | Lighthouse score > 80 on all routes, LCP < 2.5s, no JS errors in console |
| Validate the "premium agency" feel | Testers rate look-and-feel ≥ 4/5 on a blind comparison with traditional agency dashboards |

---

## 2. Beta Cohort

### Cohort Size: 8–12 testers

| Group | Count | Purpose | Recruiting |
|-------|-------|---------|------------|
| **Design-minded founders** | 3–4 | Validate that the UI communicates "premium agency" not "AI tool" | YC batch peers, indie hackers |
| **Agency operators** (design/marketing) | 2–3 | Validate workflow realism — does the brief→review→delivery loop make sense? | LinkedIn outreach, agency founder communities |
| **Potential clients** (startup marketing leads) | 2–3 | Would they trust this portal to manage their brand? | Warm intros, founder networks |
| **Technical reviewers** | 1–2 | Assess architecture, performance, code quality | Engineering peers |

---

## 3. Testing Phases

### Phase 1: Smoke Test (Day 1–2)

**Who:** Internal team only (1–2 people)
**Goal:** Catch any showstoppers before external testers see the product.

| Task | Steps | Pass Criteria |
|------|-------|---------------|
| Route smoke test | Visit all 17 routes via sidebar | Every page loads without error, content is visible |
| Cross-browser check | Test on Chrome, Firefox, Safari, Edge | No layout breakage, no JS console errors |
| Mobile responsive | Test on iPhone Safari and Android Chrome (or DevTools mobile emulation) | Sidebar collapses or scrolls, content is readable, no horizontal overflow |
| Form interaction | Complete the 5-step brief wizard end-to-end | All steps navigate, form inputs work, review step shows summary |
| Tab switching | Click all tab-based UIs (Billing, Projects, Review, Publishing, Expert) | Tab content swaps correctly, no stale state |
| Chart rendering | Verify Recharts on Dashboard, Analytics, Benchmarks, Performance, Autonomy, AI Engine | All charts render with data, tooltips work on hover |

### Phase 2: Guided Beta (Day 3–7)

**Who:** Full beta cohort (8–12 testers)
**Goal:** Structured walkthrough with feedback collection.

Each tester receives:
1. **Access link** — https://ai-native-agency.fly.dev/
2. **Testing script** (see Section 4)
3. **Feedback form** (see Section 5)
4. **Slack/Discord channel** for live questions and bug reports

#### Testing Script

Testers follow this guided flow:

```
Step 1: First Impressions (2 min)
  → Open the dashboard. What's your first reaction?
  → Does this feel like a premium agency tool or a developer prototype?
  → Rate the visual quality 1–5.

Step 2: Client Journey (5 min)
  → Navigate to Projects → New Brief
  → Walk through the 5-step brief wizard
  → Select a project type, fill in details, pick a brand, choose deliverables
  → Submit and review the confirmation
  → Navigate to Review Hub — imagine you're reviewing a deliverable
  → Try the star rating and commenting

Step 3: Brand Experience (3 min)
  → Go to Brand DNA
  → Switch between Lumina and TechFlow profiles
  → Check color palettes, typography, tone of voice
  → Try the "Extract Brand DNA from URL" feature
  → Does the brand profile feel comprehensive?

Step 4: Business Operations (3 min)
  → Visit Billing → flip through Pricing Plans, Credit Packs, Invoices, Usage tabs
  → Visit CRM & Sales → explore the kanban pipeline
  → Visit Analytics → check revenue charts and client breakdown
  → Would you trust these numbers if you were running an agency?

Step 5: YC-Worthy Features (5 min)
  → Autonomy Engine — do the "self-driving levels" concept make sense?
  → Performance Analytics — is the ROI leaderboard compelling?
  → Proactive Creative Director — would proactive AI suggestions feel valuable?
  → Feedback Copilot — type some feedback and hit Translate
  → Benchmarks — does the agency performance score feel motivating?
  → SLA Management — are the guaranteed turnaround times believable?

Step 6: Free Exploration (2 min)
  → Browse any pages you haven't seen
  → Try the AI Engine page
  → Check Auto-Publish and Expert Queue
  → Note anything confusing, broken, or surprisingly good
```

### Phase 3: Unstructured Exploration (Day 8–10)

**Who:** Subset of most engaged testers (3–5 people)
**Goal:** Find edge cases and deeper UX issues.

- Give testers full freedom to explore without a script
- Ask them to use the platform as if they were evaluating it for purchase
- Collect a recorded 15-minute Loom/screen recording of their exploration
- Debrief call with each tester (15 min)

---

## 4. Feedback Collection

### Structured Feedback Form

Send via Google Form or Typeform after each testing session.

**Section A: First Impressions**
1. On a scale of 1–5, how would you rate the overall visual quality? ☐ 1 ☐ 2 ☐ 3 ☐ 4 ☐ 5
2. Does this feel like a premium agency portal or an AI tool? ☐ Premium agency ☐ Somewhere in between ☐ AI tool
3. What was the first thing that stood out to you (positive or negative)?

**Section B: Feature Quality (rate each 1–5)**

| Feature | Rating | Notes |
|---------|--------|-------|
| Dashboard | | |
| Brief Builder (Projects → New) | | |
| Review Hub | | |
| Brand DNA | | |
| Expert Queue | | |
| Billing | | |
| CRM & Sales Pipeline | | |
| Analytics | | |
| Autonomy Engine | | |
| Performance Analytics | | |
| Proactive Creative Director | | |
| Feedback Copilot | | |
| Auto-Publish | | |
| Benchmarks | | |
| SLA Management | | |
| AI Production Engine | | |

**Section C: Usability**
1. Was anything confusing or hard to find?
2. Did you encounter any bugs or visual glitches?
3. Which feature impressed you the most?
4. Which feature needs the most work?
5. On a scale of 1–10, how likely would you be to recommend this to an agency operator?

**Section D: Strategic**
1. If you ran a design/marketing agency, would you pay for this? Why or why not?
2. What's the single most important feature missing?
3. Does the "AI-native agency" concept make sense to you?

### Bug Reports

Use this template in Slack/Discord or GitHub Issues:

```
**Page:** /dashboard (or whichever route)
**Browser:** Chrome 124 / Safari 17 / etc.
**Device:** Desktop / Mobile / Tablet
**What happened:** [describe the bug]
**What you expected:** [describe expected behavior]
**Screenshot:** [attach if possible]
```

---

## 5. Performance Testing

Run these checks before and after each beta phase.

### Lighthouse Audits

Run Lighthouse on every route. Target scores:

| Metric | Target |
|--------|--------|
| Performance | > 80 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 80 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID / INP | < 200ms |

### Routes to audit:
```
/dashboard
/projects
/projects/new
/review
/brand
/expert
/feedback
/billing
/crm
/analytics
/autonomy
/performance
/ai-engine
/proactive
/publishing
/benchmarks
/sla
```

### Load Testing (Optional)

Use `k6` or `autocannon` to verify the Fly.io deployment handles concurrent users:

```
Target: 50 concurrent users hitting random routes
Duration: 5 minutes
Pass criteria: p95 response time < 500ms, zero 5xx errors
```

---

## 6. Automated Test Coverage

### Current State: 65 E2E tests passing

| Suite | Tests | Coverage |
|-------|-------|----------|
| Route accessibility (all 17 routes) | 17 | Every page loads with visible heading |
| Sidebar navigation | 4 | Branding, sections, link clicks, active state |
| Home redirect | 1 | / → /dashboard |
| Dashboard | 4 | KPIs, chart, projects table, cost breakdown |
| Projects & Brief Builder | 4 | Project list, filters, type selection, step indicator |
| Core features (Review, Brand, Expert, Billing, CRM) | 14 | Key UI elements and interactions |
| YC features (all 9) | 21 | KPIs, charts, key content, interactive elements |

### Tests to Add After Beta

Based on beta feedback, expand coverage:
- [ ] Brief wizard: complete full 5-step flow and verify summary
- [ ] Review Hub: approve/reject a deliverable and verify state change
- [ ] Billing: switch tabs and verify content renders for each
- [ ] CRM: click lead cards and verify detail panel opens
- [ ] Feedback Copilot: type text, click Translate, verify output appears
- [ ] Brand DNA: switch brands and verify profile updates
- [ ] Expert Queue: claim an assignment and verify status change
- [ ] Proactive: accept/dismiss a suggestion and verify UI update
- [ ] Cross-browser: add Playwright projects for Firefox and WebKit

---

## 7. Known Limitations (Communicate to Testers)

Be upfront with beta testers about what is and isn't functional:

| Area | Status | Notes |
|------|--------|-------|
| Authentication | Mock only | No real login — everyone sees the same admin view |
| AI Generation | Mock data | Pipelines show simulated status, no real model calls |
| File Uploads | UI only | Upload buttons are present but don't persist files |
| Publishing | UI only | "Publish" buttons don't connect to real channels |
| Billing/Stripe | Mock only | No real payment processing |
| Data Persistence | None | All data is mock/static — refreshing resets any changes |
| Brand DNA Extraction | Animated mock | URL extraction shows a progress simulation, no real scraping |
| Feedback Translation | Canned response | Live demo returns a pre-built translation, not a real LLM call |

**Framing for testers:** "You're evaluating the product vision, UX, and information architecture — not the backend integrations. Think of this as an interactive prototype at production quality."

---

## 8. Beta Timeline

```
Day 0        Finalize testing script, feedback form, tester invitations
Day 1–2      Phase 1: Internal smoke test + bug fixes
Day 3        Send invitations to beta cohort with access + instructions
Day 3–7      Phase 2: Guided beta (testers follow script, submit feedback)
Day 5        Mid-beta check-in: triage bugs, quick fixes for critical issues
Day 8–10     Phase 3: Unstructured exploration with top testers
Day 10       Collect Loom recordings, schedule debrief calls
Day 11–12    Debrief calls (15 min each)
Day 13       Compile feedback report: bugs, UX improvements, feature requests
Day 14       Prioritize fixes and improvements into sprint backlog
```

---

## 9. Post-Beta Actions

### Immediate Fixes (Week 1 after beta)
- Fix all P0/P1 bugs reported by testers
- Address top 3 UX complaints
- Improve any routes with Lighthouse < 70

### Iteration Priorities (Week 2–3)
- Add real authentication (Clerk/Auth0)
- Connect at least one AI model for live generation demo
- Implement data persistence (PostgreSQL)
- Build the "speculative work" flow end-to-end as a live sales demo

### Metrics to Track Going Forward
- Beta NPS score (target: > 50)
- Feature quality average (target: > 4.0/5.0)
- Bug count by severity
- "Would you pay?" percentage (target: > 60%)
- Top 3 missing features by frequency of mention

---

## 10. Deployment Checklist

- [x] Frontend deployed to Fly.io: https://ai-native-agency.fly.dev/
- [x] All 17 routes accessible and rendering
- [x] 65/65 E2E tests passing against production
- [x] Git repo pushed: https://github.com/gengirish/ai-native-agency
- [ ] Custom domain configured (optional for beta)
- [ ] Error tracking added (Sentry or similar)
- [ ] Analytics added (PostHog, Mixpanel, or simple page view tracking)
- [ ] Feedback form created and tested
- [ ] Beta cohort recruited and confirmed
- [ ] Testing script and instructions sent to testers
