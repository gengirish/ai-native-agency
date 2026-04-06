import { test, expect } from "@playwright/test"

test.describe("Analytics Dashboard", () => {
  test("displays revenue metrics and charts", async ({ page }) => {
    await page.goto("/analytics")
    await expect(page.locator("text=$177,400").first()).toBeVisible({ timeout: 10000 })
    const chart = page.locator(".recharts-wrapper").first()
    await expect(chart).toBeVisible()
  })

  test("shows client revenue breakdown", async ({ page }) => {
    await page.goto("/analytics")
    await expect(page.locator("text=/lumina|techflow/i").first()).toBeVisible()
  })
})

test.describe("Autonomy Escalation Engine", () => {
  test("shows autonomy levels with lanes", async ({ page }) => {
    await page.goto("/autonomy")
    await expect(page.locator("text=/autonomous/i").first()).toBeVisible()
    await expect(page.locator("text=/spot check/i").first()).toBeVisible()
    await expect(page.locator("text=/human required/i").first()).toBeVisible()
  })

  test("displays confidence scores", async ({ page }) => {
    await page.goto("/autonomy")
    await expect(page.locator("text=/%/").first()).toBeVisible()
  })

  test("shows cost savings estimate", async ({ page }) => {
    await page.goto("/autonomy")
    await expect(page.locator("text=/saving|hours|cost/i").first()).toBeVisible()
  })
})

test.describe("Performance Analytics", () => {
  test("shows performance KPIs", async ({ page }) => {
    await page.goto("/performance")
    await expect(page.locator("text=/impression|ctr|roi/i").first()).toBeVisible()
  })

  test("displays ROI leaderboard", async ({ page }) => {
    await page.goto("/performance")
    await expect(page.locator("text=/12\\.8|leaderboard|roi/i").first()).toBeVisible()
  })

  test("has AI vs traditional comparison", async ({ page }) => {
    await page.goto("/performance")
    await expect(page.locator("text=/traditional|industry|2\\.3/i").first()).toBeVisible()
  })
})

test.describe("Proactive Creative Director", () => {
  test("shows AI-generated suggestions", async ({ page }) => {
    await page.goto("/proactive")
    await expect(page.locator("text=Earth Day Campaign").first()).toBeVisible()
  })

  test("displays trend monitor", async ({ page }) => {
    await page.goto("/proactive")
    await expect(page.locator("text=/trend|watching|monitor/i").first()).toBeVisible()
  })

  test("has accept/dismiss actions", async ({ page }) => {
    await page.goto("/proactive")
    await expect(page.locator("text=/accept|dismiss|generate/i").first()).toBeVisible()
  })
})

test.describe("Feedback Copilot", () => {
  test("shows live translation demo", async ({ page }) => {
    await page.goto("/feedback")
    await expect(page.locator("textarea").first()).toBeVisible()
    await expect(page.locator("text=/translate/i").first()).toBeVisible()
  })

  test("displays translation history", async ({ page }) => {
    await page.goto("/feedback")
    await expect(page.locator("text=/premium|pop|corporate/i").first()).toBeVisible()
  })
})

test.describe("Auto-Publishing", () => {
  test("shows connected channels", async ({ page }) => {
    await page.goto("/publishing")
    await expect(page.locator("text=/instagram|meta|linkedin/i").first()).toBeVisible()
  })

  test("displays publishing queue", async ({ page }) => {
    await page.goto("/publishing")
    await expect(page.locator("text=/live|scheduled|draft/i").first()).toBeVisible()
  })
})

test.describe("Agency Benchmarking", () => {
  test("shows performance score", async ({ page }) => {
    await page.goto("/benchmarks")
    await expect(page.locator("text=/percentile|outperform|score/i").first()).toBeVisible()
  })

  test("displays benchmark categories", async ({ page }) => {
    await page.goto("/benchmarks")
    await expect(page.locator("text=/speed|cost|quality|scale/i").first()).toBeVisible()
  })

  test("has radar chart", async ({ page }) => {
    await page.goto("/benchmarks")
    const chart = page.locator(".recharts-wrapper").first()
    await expect(chart).toBeVisible({ timeout: 10000 })
  })

  test("shows competitive moat", async ({ page }) => {
    await page.goto("/benchmarks")
    await expect(page.locator("text=/moat|advantage|compound/i").first()).toBeVisible()
  })
})

test.describe("SLA Management", () => {
  test("shows compliance overview", async ({ page }) => {
    await page.goto("/sla")
    await expect(page.locator("text=/on track|at risk|breached/i").first()).toBeVisible()
  })

  test("displays SLA tiers comparison", async ({ page }) => {
    await page.goto("/sla")
    await expect(page.locator("text=/starter|professional|enterprise/i").first()).toBeVisible()
  })

  test("has guarantee card", async ({ page }) => {
    await page.goto("/sla")
    await expect(page.locator("text=/guarantee|4.hour|money back/i").first()).toBeVisible()
  })
})

test.describe("AI Production Engine", () => {
  test("shows active pipelines", async ({ page }) => {
    await page.goto("/ai-engine")
    await expect(page.locator("text=/pipeline|lumina|techflow/i").first()).toBeVisible()
  })

  test("displays model registry", async ({ page }) => {
    await page.goto("/ai-engine")
    await expect(page.locator("text=/GPT-4o|Claude|Midjourney|Flux/i").first()).toBeVisible()
  })

  test("shows cost tracking", async ({ page }) => {
    await page.goto("/ai-engine")
    await expect(page.locator("text=/$2.85|cost/i").first()).toBeVisible()
  })
})
