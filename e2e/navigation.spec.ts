import { test, expect } from "@playwright/test"

const routes = [
  { path: "/dashboard", title: "Dashboard", heading: "Dashboard" },
  { path: "/projects", title: "Projects", heading: "Projects" },
  { path: "/projects/new", title: "New Brief", heading: /brief|project type/i },
  { path: "/review", title: "Review Hub", heading: /review/i },
  { path: "/brand", title: "Brand DNA", heading: /brand/i },
  { path: "/expert", title: "Expert Queue", heading: /expert/i },
  { path: "/feedback", title: "Feedback Copilot", heading: /feedback/i },
  { path: "/billing", title: "Billing", heading: /billing/i },
  { path: "/crm", title: "CRM & Sales", heading: /crm|sales|pipeline/i },
  { path: "/analytics", title: "Analytics", heading: /analytics/i },
  { path: "/autonomy", title: "Autonomy Engine", heading: /autonomy/i },
  { path: "/performance", title: "Performance", heading: /performance/i },
  { path: "/ai-engine", title: "AI Gateway", heading: /ai|engine|gateway|production/i },
  { path: "/proactive", title: "Creative Director", heading: /creative|director|proactive/i },
  { path: "/publishing", title: "Auto-Publish", heading: /publish/i },
  { path: "/benchmarks", title: "Benchmarks", heading: /benchmark/i },
  { path: "/sla", title: "SLA Management", heading: /sla/i },
]

test.describe("Route accessibility", () => {
  for (const route of routes) {
    test(`${route.title} page loads at ${route.path}`, async ({ page }) => {
      await page.goto(route.path)
      await expect(page).toHaveURL(route.path)
      const heading = page.locator("h1, h2").first()
      await expect(heading).toBeVisible({ timeout: 10000 })
    })
  }
})

test.describe("Sidebar navigation", () => {
  test("sidebar is visible with AgencyOS branding", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.locator("text=AgencyOS")).toBeVisible()
    await expect(page.locator("text=AI-Native Platform")).toBeVisible()
  })

  test("sidebar shows all navigation sections", async ({ page }) => {
    await page.goto("/dashboard")
    const sections = ["OVERVIEW", "PROJECTS", "BRAND", "EXPERT", "BUSINESS", "AI ENGINE", "OPERATIONS"]
    for (const section of sections) {
      await expect(page.locator(`text=${section}`).first()).toBeVisible()
    }
  })

  test("sidebar navigation links work", async ({ page }) => {
    await page.goto("/dashboard")
    await page.click("a[href='/projects']")
    await expect(page).toHaveURL("/projects")
    await page.click("a[href='/billing']")
    await expect(page).toHaveURL("/billing")
    await page.click("a[href='/dashboard']")
    await expect(page).toHaveURL("/dashboard")
  })

  test("active nav item is highlighted", async ({ page }) => {
    await page.goto("/dashboard")
    const activeLink = page.locator("a[href='/dashboard']")
    await expect(activeLink).toHaveClass(/indigo/)
  })
})

test.describe("Home redirect", () => {
  test("root redirects to /dashboard", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/dashboard")
  })
})
