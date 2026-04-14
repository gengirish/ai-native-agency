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
  id: "u_admin",
  name: "Priya Kapoor",
  email: "admin@agencyos.demo",
  role: "admin",
  tenantId: "t_demo",
  createdAt: "2025-06-01",
}

const TEST_EXPERT: TestUser = {
  id: "exp_maya",
  name: "Maya Okonkwo",
  email: "maya@agencyos.demo",
  role: "expert",
  tenantId: "t_demo",
  createdAt: "2025-07-15",
}

const TEST_CLIENT: TestUser = {
  id: "u_client_lumen",
  name: "Sarah Chen",
  email: "sarah@agencyos.demo",
  role: "client",
  tenantId: "t_demo",
  createdAt: "2025-09-10",
}

export const USERS = { admin: TEST_ADMIN, expert: TEST_EXPERT, client: TEST_CLIENT }

const TEST_PASSWORD = "demo123"

/**
 * Log in via the UI form using seeded credentials.
 * After this returns the page is on /dashboard with the sidebar visible.
 */
export async function loginAs(page: Page, role: "admin" | "expert" | "client") {
  const user = USERS[role]

  await page.goto("/login", { waitUntil: "domcontentloaded" })

  await page.locator("input[type='email']").fill(user.email)
  await page.locator("input[type='password']").fill(TEST_PASSWORD)
  await page.locator("button[type='submit']").click()

  await page.waitForURL("**/dashboard", { timeout: 30000 })
}
