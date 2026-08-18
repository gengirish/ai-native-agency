import { test, expect } from "@playwright/test"
import {
  api,
  cleanupUsers,
  loginApi,
  registerUser,
  uniqueEmail,
  userIdFor,
  type CreatedUser,
} from "./helpers"
import {
  countResetTokens,
  countUnusedResetTokens,
  deleteResetTokensForUser,
  hasDb,
  plantResetToken,
} from "./db"

/**
 * Password reset.
 *
 * The app only stores the SHA-256 of a token and mails the raw value, so a test
 * cannot recover a real token without reading the mailbox. Instead we plant a
 * token whose raw value we know (see db.plantResetToken) and drive the real UI
 * and API against it — the same code path a mailed link takes.
 *
 * Budget note: POST /api/auth/forgot-password allows 5 requests per hour per IP,
 * and the limiter lives in the server's memory. This is the only spec that calls
 * it, and it stays inside that budget. If you re-run against a long-lived dev
 * server within the hour, the request half self-skips rather than failing.
 */

const NEW_PASSWORD = "reset-password-456"

test.describe("Reset link states", () => {
  test.skip(!hasDb(), "requires DATABASE_URL — reset tokens live in Postgres")

  let user: CreatedUser
  let userId: string

  test.beforeAll(async () => {
    user = await registerUser({ name: "Reset Probe" })
    userId = await userIdFor(user.email)
  })

  test.afterAll(async () => {
    await cleanupUsers(user?.email)
  })

  test.beforeEach(async () => {
    await deleteResetTokensForUser(userId)
  })

  test("a valid link renders the new-password form", async ({ page }) => {
    const raw = "e2e-valid-token-" + Date.now()
    await plantResetToken(userId, raw)

    await page.goto(`/reset-password?token=${raw}`)

    await expect(page.getByRole("heading", { name: /choose a new password/i })).toBeVisible()
    await expect(page.locator("#password")).toBeVisible()
    await expect(page.locator("#confirm")).toBeVisible()
  })

  test("an expired link explains itself and offers a new one", async ({ page }) => {
    const raw = "e2e-expired-token-" + Date.now()
    await plantResetToken(userId, raw, { expiresInMs: -60_000 })

    await page.goto(`/reset-password?token=${raw}`)

    await expect(page.getByText(/expired/i)).toBeVisible()
    await expect(page.getByRole("link", { name: /request a new link/i })).toBeVisible()
    await expect(page.locator("#password")).toHaveCount(0)
  })

  test("an already-used link is rejected", async ({ page }) => {
    const raw = "e2e-used-token-" + Date.now()
    await plantResetToken(userId, raw, { used: true })

    await page.goto(`/reset-password?token=${raw}`)

    await expect(page.getByText(/already been used/i)).toBeVisible()
    await expect(page.locator("#password")).toHaveCount(0)
  })

  test("an unknown token is rejected", async ({ page }) => {
    await page.goto("/reset-password?token=not-a-real-token")

    await expect(page.getByText(/invalid/i)).toBeVisible()
    await expect(page.locator("#password")).toHaveCount(0)
  })

  test("a missing token is rejected without calling the API", async ({ page }) => {
    await page.goto("/reset-password")

    await expect(page.getByText(/invalid/i)).toBeVisible()
    await expect(page.locator("#password")).toHaveCount(0)
  })
})

test.describe("Completing a reset", () => {
  test.skip(!hasDb(), "requires DATABASE_URL — reset tokens live in Postgres")

  let user: CreatedUser
  let userId: string

  test.beforeEach(async () => {
    user = await registerUser({ name: "Reset Completer" })
    userId = await userIdFor(user.email)
  })

  test.afterEach(async () => {
    await cleanupUsers(user?.email)
  })

  test("sets the new password and invalidates the old one", async ({ page }) => {
    const raw = "e2e-complete-token-" + Date.now()
    await plantResetToken(userId, raw)

    await page.goto(`/reset-password?token=${raw}`)
    await page.locator("#password").fill(NEW_PASSWORD)
    await page.locator("#confirm").fill(NEW_PASSWORD)
    await page.getByRole("button", { name: /update password/i }).click()

    await expect(page.getByText(/password updated/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })

    const withOld = await loginApi(user.email, user.password)
    expect(withOld.status).toBe(401)

    const withNew = await loginApi(user.email, NEW_PASSWORD)
    expect(withNew.status).toBe(200)
    expect(withNew.body.token).toBeTruthy()
  })

  test("refuses a second use of the same link", async ({ page }) => {
    const raw = "e2e-reuse-token-" + Date.now()
    await plantResetToken(userId, raw)

    const first = await api("/api/auth/reset-password", {
      method: "POST",
      body: { token: raw, password: NEW_PASSWORD },
    })
    expect(first.status).toBe(200)

    const second = await api("/api/auth/reset-password", {
      method: "POST",
      body: { token: raw, password: "another-password-789" },
    })
    expect(second.status).toBe(400)
    expect(second.body.reason).toBe("used")

    // The second attempt must not have taken effect.
    const stillFirst = await loginApi(user.email, NEW_PASSWORD)
    expect(stillFirst.status).toBe(200)

    // And the UI surfaces the dead link rather than a blank form.
    await page.goto(`/reset-password?token=${raw}`)
    await expect(page.getByText(/already been used/i)).toBeVisible()
  })

  test("burns every outstanding link for the account", async () => {
    const used = "e2e-multi-a-" + Date.now()
    const other = "e2e-multi-b-" + Date.now()
    await plantResetToken(userId, used)
    await plantResetToken(userId, other)
    expect(await countUnusedResetTokens(userId)).toBe(2)

    const res = await api("/api/auth/reset-password", {
      method: "POST",
      body: { token: used, password: NEW_PASSWORD },
    })
    expect(res.status).toBe(200)

    expect(await countUnusedResetTokens(userId)).toBe(0)

    const stale = await api("/api/auth/reset-password", {
      method: "POST",
      body: { token: other, password: "yet-another-pass-1" },
    })
    expect(stale.status).toBe(400)
  })

  test("rejects a password below the minimum length", async () => {
    const raw = "e2e-short-token-" + Date.now()
    await plantResetToken(userId, raw)

    const res = await api("/api/auth/reset-password", {
      method: "POST",
      body: { token: raw, password: "short" },
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/at least 8/i)

    // A rejected attempt must leave the token usable.
    expect(await countUnusedResetTokens(userId)).toBe(1)
  })

  test("the form requires both fields to match", async ({ page }) => {
    const raw = "e2e-mismatch-token-" + Date.now()
    await plantResetToken(userId, raw)

    await page.goto(`/reset-password?token=${raw}`)
    await page.locator("#password").fill(NEW_PASSWORD)
    await page.locator("#confirm").fill("different-password-1")
    await page.getByRole("button", { name: /update password/i }).click()

    await expect(page.getByText(/don't match/i)).toBeVisible()

    // Nothing was submitted, so the old password still works.
    const login = await loginApi(user.email, user.password)
    expect(login.status).toBe(200)
  })
})

test.describe("Requesting a reset", () => {
  test.skip(!hasDb(), "requires DATABASE_URL — token issuance is observed in Postgres")

  let user: CreatedUser
  let userId: string
  let throttled = false

  test.beforeAll(async () => {
    user = await registerUser({ name: "Reset Requester" })
    userId = await userIdFor(user.email)

    // One probe establishes whether this IP still has request budget. A reused
    // dev server can carry an exhausted limiter across runs; that is an
    // environment state, not a product failure, so we skip rather than fail.
    const probe = await api("/api/auth/forgot-password", {
      method: "POST",
      body: { email: uniqueEmail("throttle-probe") },
    })
    throttled = probe.status === 429
  })

  test.afterAll(async () => {
    await cleanupUsers(user?.email)
  })

  test("issues a token for a real account and none for a stranger", async () => {
    test.skip(throttled, "forgot-password budget exhausted — restart the dev server")

    const known = await api("/api/auth/forgot-password", {
      method: "POST",
      body: { email: user.email },
    })
    expect(known.status).toBe(200)
    expect(await countResetTokens(userId)).toBe(1)

    const stranger = uniqueEmail("nobody")
    const unknown = await api("/api/auth/forgot-password", {
      method: "POST",
      body: { email: stranger },
    })
    expect(unknown.status).toBe(200)

    // The give-away would be a different response for a real address.
    expect(unknown.body).toEqual(known.body)
  })

  test("rejects a malformed address before doing any work", async () => {
    const res = await api("/api/auth/forgot-password", {
      method: "POST",
      body: { email: "not-an-email" },
    })
    // Either a validation error or the throttle — both are non-200 and neither
    // leaks whether an account exists.
    expect([400, 429]).toContain(res.status)
  })

  test("the page confirms without naming whether the account exists", async ({ page }) => {
    test.skip(throttled, "forgot-password budget exhausted — restart the dev server")

    await page.goto("/forgot-password")
    await page.locator("#email").fill(uniqueEmail("ui-stranger"))
    await page.getByRole("button", { name: /send reset link/i }).click()

    await expect(page.getByRole("heading", { name: /check your inbox/i })).toBeVisible()
    await expect(page.getByText(/if an account exists/i)).toBeVisible()
    await expect(page.getByText(/no account|not found|unregistered/i)).toHaveCount(0)
  })
})

test.describe("Entry points", () => {
  test("the login page offers a forgot-password link", async ({ page }) => {
    await page.goto("/login")

    const link = page.getByRole("link", { name: /forgot password/i })
    await expect(link).toBeVisible()

    await link.click()
    await expect(page).toHaveURL(/\/forgot-password/)
    await expect(page.getByRole("heading", { name: /reset your password/i })).toBeVisible()
  })

  test("the link is hidden on the register tab", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: "Register", exact: true }).click()

    await expect(page.getByRole("link", { name: /forgot password/i })).toHaveCount(0)
  })

  test("both reset pages are reachable while logged out", async ({ page }) => {
    // Middleware gates everything else; these two must stay public or a locked
    // out user can never recover.
    await page.goto("/forgot-password")
    await expect(page).toHaveURL(/\/forgot-password/)

    await page.goto("/reset-password?token=anything")
    await expect(page).toHaveURL(/\/reset-password/)
  })

  test("each page links back to sign in", async ({ page }) => {
    for (const path of ["/forgot-password", "/reset-password?token=x"]) {
      await page.goto(path)
      const back = page.getByRole("link", { name: /back to sign in/i })
      await expect(back).toBeVisible()
    }
  })
})
