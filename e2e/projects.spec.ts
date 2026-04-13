import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

test.describe("Projects list", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
  })

  test("shows projects page with heading", async ({ page }) => {
    await page.goto("/projects")
    await expect(page.locator("h1, h2").first()).toBeVisible()
  })

  test("shows empty state or project list", async ({ page }) => {
    await page.goto("/projects")
    const content = page.locator("text=/no projects yet|new brief|deliverables|lumen|pulse|northwind/i").first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Brief Builder wizard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
  })

  test("displays project type selection on step 1", async ({ page }) => {
    await page.goto("/projects/new")
    await expect(page.locator("text=/logo|social|brand|video/i").first()).toBeVisible()
  })

  test("shows step indicator", async ({ page }) => {
    await page.goto("/projects/new")
    const steps = page.locator("text=/step|1|2|3|4|5/i")
    await expect(steps.first()).toBeVisible()
  })
})
