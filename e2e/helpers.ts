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
  email: "admin@test.com",
  role: "admin",
  tenantId: "t-test",
  createdAt: "2026-01-01",
}

const TEST_EXPERT: TestUser = {
  id: "test-expert",
  name: "Test Expert",
  email: "expert@test.com",
  role: "expert",
  tenantId: "t-test",
  createdAt: "2026-01-01",
}

const TEST_CLIENT: TestUser = {
  id: "test-client",
  name: "Test Client",
  email: "client@test.com",
  role: "client",
  tenantId: "t-client",
  createdAt: "2026-01-01",
}

export const USERS = { admin: TEST_ADMIN, expert: TEST_EXPERT, client: TEST_CLIENT }

/**
 * Seed auth into localStorage and navigate to /dashboard.
 * After this returns the page is on /dashboard with the sidebar visible.
 */
export async function loginAs(page: Page, role: "admin" | "expert" | "client") {
  const user = USERS[role]

  // Navigate to login to get on the same origin for localStorage access
  await page.goto("/login", { waitUntil: "commit" })

  // Inject auth data into localStorage
  await page.evaluate(
    ({ u, pw }) => {
      localStorage.setItem("agencyos_auth", JSON.stringify(u))
      const users = JSON.parse(localStorage.getItem("agencyos_users") || "[]")
      if (!users.find((x: { email: string }) => x.email === u.email)) {
        users.push(u)
        localStorage.setItem("agencyos_users", JSON.stringify(users))
      }
      const passwords = JSON.parse(localStorage.getItem("agencyos_passwords") || "{}")
      passwords[u.email] = pw
      localStorage.setItem("agencyos_passwords", JSON.stringify(passwords))
    },
    { u: user, pw: "test1234" }
  )

  // Navigate to dashboard and wait for sidebar to prove auth hydrated
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" })
  await page.waitForSelector("text=AgencyOS", { timeout: 30000 })
}
