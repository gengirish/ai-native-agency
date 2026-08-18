import { expect, type Page } from "@playwright/test"
import { deleteUserByEmail, findUserIdByEmail, hasDb } from "./db"

export const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000"

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

/* ------------------------------------------------------------------ */
/*  API helpers                                                       */
/* ------------------------------------------------------------------ */

export interface ApiOptions {
  method?: string
  body?: unknown
  /** Sent as both cookie and bearer — middleware checks the cookie, routes check the header. */
  token?: string
  /** Send only the cookie, omitting the Authorization header. */
  cookieOnly?: boolean
  headers?: Record<string, string>
}

export interface ApiResult<T = any> {
  status: number
  ok: boolean
  body: T
  raw: string
}

/**
 * Call an API route the way the app does.
 *
 * Auth is enforced in two places: middleware gates /api/* on the
 * `agencyos_token` cookie, and each route independently resolves the user from
 * the Authorization header. Sending both mirrors a real browser session;
 * `cookieOnly` exists so tests can prove the second layer stands on its own.
 */
export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { ...options.headers }

  if (options.body !== undefined) headers["Content-Type"] = "application/json"
  if (options.token) {
    headers["Cookie"] = `agencyos_token=${options.token}`
    if (!options.cookieOnly) headers["Authorization"] = `Bearer ${options.token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    redirect: "manual",
  })

  const raw = await res.text()
  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    body = raw
  }

  return { status: res.status, ok: res.ok, body: body as T, raw }
}

export async function loginApi(email: string, password: string): Promise<ApiResult> {
  return api("/api/auth/login", { method: "POST", body: { email, password } })
}

/* ------------------------------------------------------------------ */
/*  Disposable users                                                  */
/* ------------------------------------------------------------------ */

export interface CreatedUser {
  id: string
  name: string
  email: string
  password: string
  role: string
  tenantId: string
  token: string
}

let userCounter = 0

/** Unique per run so parallel workers and repeat runs never collide. */
export function uniqueEmail(prefix = "e2e"): string {
  userCounter += 1
  return `${prefix}-${Date.now()}-${process.pid}-${userCounter}@e2e.invalid`
}

/**
 * Register a throwaway account through the public API. Registration always
 * lands in the self-serve tenant, which is what makes these users useful for
 * proving tenant isolation against the seeded demo tenant.
 */
export async function registerUser(
  overrides: { email?: string; password?: string; name?: string } = {},
): Promise<CreatedUser> {
  const email = overrides.email ?? uniqueEmail()
  const password = overrides.password ?? "e2e-password-123"
  const name = overrides.name ?? "E2E Probe"

  const res = await api("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  })

  if (res.status !== 201) {
    throw new Error(`registerUser failed: ${res.status} ${res.raw}`)
  }

  return { ...res.body.user, password, token: res.body.token }
}

/** Delete accounts a test created. Safe to call for users that never existed. */
export async function cleanupUsers(...emails: string[]): Promise<void> {
  if (!hasDb()) return
  for (const email of emails) {
    if (email) await deleteUserByEmail(email)
  }
}

export async function userIdFor(email: string): Promise<string> {
  const id = await findUserIdByEmail(email)
  if (!id) throw new Error(`No user row for ${email}`)
  return id
}

/** Put a token into the browser the way loginAs does, for an arbitrary account. */
export async function applySession(page: Page, token: string): Promise<void> {
  const hostname = new URL(BASE_URL).hostname
  await page.context().addCookies([
    { name: "agencyos_token", value: token, domain: hostname, path: "/" },
  ])
  await page.addInitScript(
    `localStorage.setItem("agencyos_token", ${JSON.stringify(token)})`,
  )
}

/**
 * Navigate and wait for the auth shell to finish resolving.
 *
 * AppShell renders a full-screen "Loading" status until the AuthProvider has
 * read the token and the first data fetch settles. Asserting page content
 * before that resolves is the main source of flakiness against a dev server
 * under parallel load.
 */
export async function gotoApp(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await expect(page.getByRole("status", { name: "Loading" })).toHaveCount(0, {
    timeout: 60_000,
  })
}
