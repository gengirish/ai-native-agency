import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

const adminRoutes = [
  { path: "/dashboard", heading: "Dashboard" },
  { path: "/projects", heading: /projects/i },
  { path: "/projects/new", heading: /brief|project type/i },
  { path: "/review", heading: /review/i },
  { path: "/brand", heading: /brand/i },
  { path: "/expert", heading: /expert/i },
  { path: "/feedback", heading: /feedback/i },
  { path: "/billing", heading: /billing/i },
  { path: "/crm", heading: /crm|sales|pipeline/i },
  { path: "/analytics", heading: /analytics/i },
  { path: "/autonomy", heading: /autonomy/i },
  { path: "/performance", heading: /performance/i },
  { path: "/ai-engine", heading: /ai|engine|gateway|production/i },
  { path: "/proactive", heading: /creative|director|proactive/i },
  { path: "/publishing", heading: /publish/i },
  { path: "/benchmarks", heading: /benchmark/i },
  { path: "/sla", heading: /sla/i },
]

test.describe("Route accessibility (admin)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
  })

  for (const route of adminRoutes) {
    test(`${route.path} loads`, async ({ page }) => {
      await page.goto(route.path)
      const heading = page.locator("h1, h2").first()
      await expect(heading).toBeVisible({ timeout: 10000 })
    })
  }
})

test.describe("Sidebar navigation", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
  })

  test("sidebar is visible with AgencyOS branding", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.locator("text=AgencyOS")).toBeVisible()
    await expect(page.locator("text=AI-Native Platform")).toBeVisible()
  })

  test("sidebar shows all sections for admin", async ({ page }) => {
    await page.goto("/dashboard")
    for (const section of ["OVERVIEW", "PROJECTS", "BRAND", "EXPERT", "BUSINESS", "AI ENGINE", "OPERATIONS"]) {
      await expect(page.locator(`text=${section}`).first()).toBeVisible()
    }
  })

  test("sidebar navigation links work", async ({ page }) => {
    await page.goto("/dashboard")
    await page.click("a[href='/projects']")
    await expect(page).toHaveURL("/projects")
    await page.click("a[href='/dashboard']")
    await expect(page).toHaveURL("/dashboard")
  })

  test("shows logged-in user info", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.locator("text=Test Admin")).toBeVisible()
    await expect(page.locator("text=Agency Admin")).toBeVisible()
  })
})

test.describe("Auth redirect", () => {
  test("unauthenticated user is redirected to /login", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL("/login", { timeout: 10000 })
  })

  test("unauthenticated user sees public landing at /", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/")
    await expect(page.getByRole("heading", { name: /AI-native agencies/i })).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole("link", { name: /get started|launch agencyos/i }).first()).toBeVisible()
  })

  test("root redirects to /dashboard when authenticated", async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/")
    await expect(page).toHaveURL("/dashboard", { timeout: 10000 })
  })
})
