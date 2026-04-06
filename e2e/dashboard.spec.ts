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
    const chartOrEmpty = page.locator(".recharts-wrapper, text=/no data|no revenue/i").first()
    await expect(chartOrEmpty).toBeVisible({ timeout: 10000 })
  })

  test("shows empty or data state for projects", async ({ page }) => {
    const content = page.locator("text=/active projects|no projects|no data/i").first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })
})
