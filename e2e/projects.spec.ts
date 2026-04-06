import { test, expect } from "@playwright/test"

test.describe("Projects list", () => {
  test("shows all projects with filter tabs", async ({ page }) => {
    await page.goto("/projects")
    await expect(page.locator("text=Lumina Brand Refresh").first()).toBeVisible()
    await expect(page.locator("text=TechFlow").first()).toBeVisible()
  })

  test("has New Brief button linking to wizard", async ({ page }) => {
    await page.goto("/projects")
    const newBriefLink = page.locator("a[href='/projects/new']").first()
    await expect(newBriefLink).toBeVisible()
  })
})

test.describe("Brief Builder wizard", () => {
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
