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
  id: "00000000-0000-0000-0000-000000000010",
  name: "Priya Kapoor",
  email: "admin@agencyos.demo",
  role: "admin",
  tenantId: "00000000-0000-0000-0000-000000000001",
  createdAt: "2025-06-01",
}

const TEST_EXPERT: TestUser = {
  id: "00000000-0000-0000-0000-000000000011",
  name: "Maya Okonkwo",
  email: "maya@agencyos.demo",
  role: "expert",
  tenantId: "00000000-0000-0000-0000-000000000001",
  createdAt: "2025-07-15",
}

const TEST_CLIENT: TestUser = {
  id: "00000000-0000-0000-0000-000000000013",
  name: "Sarah Chen",
  email: "sarah@agencyos.demo",
  role: "client",
  tenantId: "00000000-0000-0000-0000-000000000001",
  createdAt: "2025-09-10",
}

export const USERS = { admin: TEST_ADMIN, expert: TEST_EXPERT, client: TEST_CLIENT }

const TEST_PASSWORD = "demo123"

/**
 * Log in by calling the login API directly, then injecting the token into
 * the browser context (localStorage + cookie). Faster and more reliable than
 * filling the UI form, especially with Neon cold starts and first-run
 * Turbopack compilation.
 */
export async function loginAs(page: Page, role: "admin" | "expert" | "client") {
  const user = USERS[role]
  const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000"

  const res = await fetch(`${baseURL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: TEST_PASSWORD }),
  })

  if (!res.ok) {
    throw new Error(`Login API failed for ${role}: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { token: string }
  const hostname = new URL(baseURL).hostname

  await page.context().addCookies([
    {
      name: "agencyos_token",
      value: data.token,
      domain: hostname,
      path: "/",
    },
  ])

  // Inject token into localStorage before any page script runs.
  // addInitScript fires before React hydrates, so the AuthProvider's
  // useEffect will find the token on first mount.
  await page.addInitScript(
    `localStorage.setItem("agencyos_token", ${JSON.stringify(data.token)})`,
  )
}
