import type { Page } from "@playwright/test"

export interface TestUser {
  id: string
  name: string
  email: string
  role: "admin" | "expert" | "client"
  tenantId: string
  createdAt: string
}

const TEST_ADMIN: TestUser = {
  id: "test-admin",
  name: "Test Admin",
  email: "admin@agencyos.dev",
  role: "admin",
  tenantId: "t-test",
  createdAt: "2026-01-01",
}

const TEST_EXPERT: TestUser = {
  id: "test-expert",
  name: "Test Expert",
  email: "expert@agencyos.dev",
  role: "expert",
  tenantId: "t-test",
  createdAt: "2026-01-01",
}

const TEST_CLIENT: TestUser = {
  id: "test-client",
  name: "Test Client",
  email: "client@agencyos.dev",
  role: "client",
  tenantId: "t-client",
  createdAt: "2026-01-01",
}

export const USERS = { admin: TEST_ADMIN, expert: TEST_EXPERT, client: TEST_CLIENT }

const TEST_PASSWORD = "test1234"

/**
 * Log in via the UI form using seeded credentials.
 * After this returns the page is on /dashboard with the sidebar visible.
 */
export async function loginAs(page: Page, role: "admin" | "expert" | "client") {
  const user = USERS[role]

  await page.goto("/login", { waitUntil: "domcontentloaded" })

  // Fill the login form
  await page.locator("input[type='email']").fill(user.email)
  await page.locator("input[type='password']").fill(TEST_PASSWORD)
  await page.locator("button[type='submit']").click()

  // Wait for redirect to dashboard
  await page.waitForURL("**/dashboard", { timeout: 30000 })
  await page.waitForSelector("h1:has-text('AgencyOS')", { timeout: 30000 })
}
