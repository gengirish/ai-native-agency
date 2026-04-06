import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

test.describe("Review Hub", () => {
  test("displays review page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/review")
    await expect(page.locator("text=/review/i").first()).toBeVisible()
  })
})

test.describe("Brand DNA", () => {
  test("shows brand page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/brand")
    await expect(page.locator("text=/brand/i").first()).toBeVisible()
  })

  test("shows empty state or brand profiles", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/brand")
    const content = page.locator("text=/no brand|brand dna|extract/i").first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Expert Dashboard", () => {
  test("shows expert page", async ({ page }) => {
    await loginAs(page, "expert")
    await page.goto("/expert")
    await expect(page.locator("text=/expert/i").first()).toBeVisible()
  })

  test("shows empty or assignment state", async ({ page }) => {
    await loginAs(page, "expert")
    await page.goto("/expert")
    const content = page.locator("text=/no assignment|queue|review/i").first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Billing", () => {
  test("loads billing page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/billing")
    await expect(page.locator("text=/billing/i").first()).toBeVisible()
  })
})

test.describe("CRM & Sales", () => {
  test("loads CRM page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/crm")
    await expect(page.locator("text=/crm|sales|pipeline/i").first()).toBeVisible()
  })
})
