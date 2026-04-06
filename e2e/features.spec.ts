import { test, expect } from "@playwright/test"

test.describe("Review Hub", () => {
  test("displays review queue", async ({ page }) => {
    await page.goto("/review")
    await expect(page.locator("text=/review|pending|approved/i").first()).toBeVisible()
  })
})

test.describe("Brand DNA", () => {
  test("shows brand profiles", async ({ page }) => {
    await page.goto("/brand")
    await expect(page.locator("text=Lumina").first()).toBeVisible()
  })

  test("displays color palette", async ({ page }) => {
    await page.goto("/brand")
    await expect(page.locator("text=/#[0-9A-Fa-f]{6}/").first()).toBeVisible()
  })

  test("has URL extraction feature", async ({ page }) => {
    await page.goto("/brand")
    await expect(page.locator("text=/extract|url|brand dna/i").first()).toBeVisible()
  })
})

test.describe("Expert Dashboard", () => {
  test("shows expert queue with assignments", async ({ page }) => {
    await page.goto("/expert")
    await expect(page.locator("text=/queue|review|claim/i").first()).toBeVisible()
  })

  test("displays expert stats", async ({ page }) => {
    await page.goto("/expert")
    await expect(page.locator("text=/completed|review time/i").first()).toBeVisible()
  })
})

test.describe("Billing", () => {
  test("shows pricing tiers", async ({ page }) => {
    await page.goto("/billing")
    await expect(page.locator("text=/starter|professional|enterprise/i").first()).toBeVisible()
  })

  test("displays invoices", async ({ page }) => {
    await page.goto("/billing")
    await page.getByRole("button", { name: "Invoices" }).click()
    await expect(page.locator("text=Lumina Brands").first()).toBeVisible({ timeout: 10000 })
  })
})

test.describe("CRM & Sales", () => {
  test("shows lead pipeline", async ({ page }) => {
    await page.goto("/crm")
    await expect(page.locator("text=Meridian Labs").first()).toBeVisible()
  })

  test("has speculative work section", async ({ page }) => {
    await page.goto("/crm")
    await expect(page.locator("text=/speculative|sample work/i").first()).toBeVisible()
  })
})
