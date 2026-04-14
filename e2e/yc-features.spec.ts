import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

test.describe("Analytics Dashboard", () => {
  test("loads analytics page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/analytics")
    await expect(page.locator("text=/analytics/i").first()).toBeVisible()
  })
})

test.describe("Autonomy Escalation Engine", () => {
  test("loads autonomy page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/autonomy")
    await expect(page.locator("text=/autonomy/i").first()).toBeVisible()
  })
})

test.describe("Performance Analytics", () => {
  test("loads performance page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/performance")
    await expect(page.locator("text=/performance/i").first()).toBeVisible()
  })
})

test.describe("Proactive Creative Director", () => {
  test("loads proactive page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/proactive")
    await expect(page.locator("text=/creative|director|proactive/i").first()).toBeVisible()
  })
})

test.describe("Feedback Copilot", () => {
  test("loads feedback page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/feedback")
    await expect(page.locator("text=/feedback/i").first()).toBeVisible()
  })
})

test.describe("Auto-Publishing", () => {
  test("loads publishing page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/publishing")
    await expect(page.locator("text=/publish/i").first()).toBeVisible()
  })
})

test.describe("Agency Benchmarking", () => {
  test("loads benchmarks page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/benchmarks")
    await expect(page.locator("text=/benchmark/i").first()).toBeVisible()
  })
})

test.describe("SLA Management", () => {
  test("loads SLA page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/sla")
    await expect(page.locator("text=/sla/i").first()).toBeVisible()
  })
})

test.describe("AI Production Engine", () => {
  test("loads AI engine page", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/ai-engine")
    await expect(page.locator("text=/ai|engine|gateway|production/i").first()).toBeVisible()
  })
})

test.describe("RBAC - Role Gating", () => {
  test("client cannot see admin-only nav sections", async ({ page }) => {
    await loginAs(page, "client")
    await page.goto("/dashboard")
    await expect(page.getByRole("heading", { name: "AgencyOS" })).toBeVisible()
    await expect(page.locator("text=OPERATIONS")).not.toBeVisible()
    await expect(page.locator("text=AI ENGINE")).not.toBeVisible()
  })

  test("client sees restricted sidebar", async ({ page }) => {
    await loginAs(page, "client")
    await page.goto("/dashboard")
    await expect(page.locator("a[href='/dashboard']")).toBeVisible()
    await expect(page.locator("a[href='/projects']")).toBeVisible()
    await expect(page.locator("a[href='/crm']")).not.toBeVisible()
    await expect(page.locator("a[href='/analytics']")).not.toBeVisible()
  })

  test("expert sees only expert-relevant sections", async ({ page }) => {
    await loginAs(page, "expert")
    await page.goto("/dashboard")
    await expect(page.locator("a[href='/expert']")).toBeVisible()
    await expect(page.locator("a[href='/review']")).toBeVisible()
    await expect(page.locator("a[href='/crm']")).not.toBeVisible()
    await expect(page.locator("a[href='/billing']")).not.toBeVisible()
  })

  test("admin page shows access restricted for client", async ({ page }) => {
    await loginAs(page, "client")
    await page.goto("/analytics")
    await expect(page.locator("text=/access restricted/i")).toBeVisible({ timeout: 10000 })
  })
})

test.describe("Login Page", () => {
  test("displays login form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: "AgencyOS" })).toBeVisible()
    await expect(page.locator("text=Sign In").first()).toBeVisible()
    await expect(page.locator("text=Register").first()).toBeVisible()
  })

  test("shows registration form with role selection", async ({ page }) => {
    await page.goto("/login")
    await page.click("text=Register")
    await expect(page.locator("form").getByText("Agency Admin")).toBeVisible()
    await expect(page.locator("form").getByText("Expert Reviewer")).toBeVisible()
    await expect(page.locator("form").getByText("Client")).toBeVisible()
  })

  test("login with seeded account redirects to dashboard", async ({ page }) => {
    await page.goto("/login")
    await page.locator("input[type='email']").fill("admin@agencyos.demo")
    await page.locator("input[type='password']").fill("demo123")
    await page.locator("button[type='submit']").click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
  })
})
