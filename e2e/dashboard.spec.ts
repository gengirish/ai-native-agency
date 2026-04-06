import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
  })

  test("displays KPI cards with stats", async ({ page }) => {
    await expect(page.locator("text=$58,500").first()).toBeVisible()
    await expect(page.locator("text=/89\\.5%|89%/").first()).toBeVisible()
  })

  test("shows revenue chart", async ({ page }) => {
    const chart = page.locator(".recharts-wrapper").first()
    await expect(chart).toBeVisible({ timeout: 10000 })
  })

  test("displays active projects table", async ({ page }) => {
    await expect(page.locator("text=TechFlow Social Campaign").first()).toBeVisible()
  })

  test("shows cost breakdown section", async ({ page }) => {
    await expect(page.locator("text=/AI Compute|Expert Review/").first()).toBeVisible()
  })
})
