import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/dashboard")
  })

  test("displays Dashboard heading", async ({ page }) => {
    await expect(page.locator("h1:has-text('Dashboard')")).toBeVisible()
  })

  test("shows KPI cards section", async ({ page }) => {
    await expect(page.locator("text=/revenue|projects|margin|quality/i").first()).toBeVisible()
  })

  test("shows empty or data state for revenue chart", async ({ page }) => {
    const chart = page.locator(".recharts-wrapper").first()
    const empty = page.locator("text=/no data|no revenue/i").first()
    await expect(chart.or(empty)).toBeVisible()
  })

  test("shows empty or data state for projects", async ({ page }) => {
    const content = page.locator("text=/active projects|total projects|no projects|no data/i").first()
    await expect(content).toBeVisible()
  })
})
