import { test, expect } from "@playwright/test"
import { api, cleanupUsers, loginApi, registerUser, uniqueEmail, type CreatedUser } from "./helpers"
import { USERS } from "./helpers"

/**
 * API contract — the behaviour the UI depends on and an attacker probes first.
 *
 * These run against the HTTP surface directly rather than through a browser, so
 * they cover the cases a page never produces: malformed bodies, tampered
 * tokens, a cookie without its matching Authorization header.
 */

const DEMO_PASSWORD = "demo123"

test.describe("Login", () => {
  test("rejects a wrong password", async () => {
    const res = await loginApi(USERS.admin.email, "not-the-password")
    expect(res.status).toBe(401)
    expect(res.body.token).toBeUndefined()
  })

  test("gives the same answer for an unknown account", async () => {
    const wrongPassword = await loginApi(USERS.admin.email, "not-the-password")
    const unknownUser = await loginApi(uniqueEmail("ghost"), "not-the-password")

    expect(unknownUser.status).toBe(401)
    // Identical copy either way — otherwise login enumerates accounts.
    expect(unknownUser.body).toEqual(wrongPassword.body)
  })

  test("rejects missing fields", async () => {
    const res = await api("/api/auth/login", { method: "POST", body: { email: USERS.admin.email } })
    expect(res.status).toBe(400)
  })

  test("rejects a malformed body", async () => {
    const res = await api("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: undefined,
    })
    expect(res.status).toBe(400)
  })

  test("never returns the password hash", async () => {
    const res = await loginApi(USERS.admin.email, DEMO_PASSWORD)
    expect(res.status).toBe(200)
    expect(res.raw).not.toContain("passwordHash")
    expect(res.raw).not.toContain("password_hash")
    expect(res.raw).not.toContain("$2a$")
    expect(res.raw).not.toContain("$2b$")
  })

  test("returns a token carrying the caller's tenant", async () => {
    const res = await loginApi(USERS.admin.email, DEMO_PASSWORD)
    expect(res.status).toBe(200)

    const claims = JSON.parse(
      Buffer.from(res.body.token.split(".")[1], "base64url").toString("utf8"),
    )
    expect(claims.sub).toBeTruthy()
    expect(claims.tenantId).toBeTruthy()
    expect(claims.role).toBe("admin")
    expect(claims.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
  })
})

test.describe("Registration", () => {
  const created: string[] = []

  test.afterAll(async () => {
    await cleanupUsers(...created)
  })

  test("rejects a password under 8 characters", async () => {
    const res = await api("/api/auth/register", {
      method: "POST",
      body: { name: "Shorty", email: uniqueEmail("short"), password: "abc123" },
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/8 characters/i)
  })

  test("rejects a malformed email", async () => {
    const res = await api("/api/auth/register", {
      method: "POST",
      body: { name: "Nobody", email: "not-an-email", password: "valid-password-1" },
    })
    expect(res.status).toBe(400)
  })

  test("rejects missing fields", async () => {
    const res = await api("/api/auth/register", {
      method: "POST",
      body: { email: uniqueEmail("partial") },
    })
    expect(res.status).toBe(400)
  })

  test("rejects a duplicate address", async () => {
    const email = uniqueEmail("dupe")
    created.push(email)

    const first = await api("/api/auth/register", {
      method: "POST",
      body: { name: "First", email, password: "valid-password-1" },
    })
    expect(first.status).toBe(201)

    const second = await api("/api/auth/register", {
      method: "POST",
      body: { name: "Second", email, password: "valid-password-1" },
    })
    expect(second.status).toBe(409)
  })

  test("self-serve signups never land as admin", async () => {
    const email = uniqueEmail("role")
    created.push(email)

    const res = await api("/api/auth/register", {
      method: "POST",
      // A caller who asks for admin must not receive it.
      body: { name: "Climber", email, password: "valid-password-1", role: "admin" },
    })
    expect(res.status).toBe(201)
    expect(res.body.user.role).toBe("client")
  })

  test("normalises the address to lower case", async () => {
    const email = uniqueEmail("Case").toUpperCase()
    created.push(email.toLowerCase())

    const res = await api("/api/auth/register", {
      method: "POST",
      body: { name: "Shouty", email, password: "valid-password-1" },
    })
    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe(email.toLowerCase())

    // And the lower-cased form is what logs in.
    const login = await loginApi(email.toLowerCase(), "valid-password-1")
    expect(login.status).toBe(200)
  })
})

test.describe("Session", () => {
  let user: CreatedUser

  test.beforeAll(async () => {
    user = await registerUser({ name: "Session Probe" })
  })

  test.afterAll(async () => {
    await cleanupUsers(user?.email)
  })

  test("me returns null without a token", async () => {
    const res = await api("/api/auth/me")
    expect(res.status).toBe(200)
    expect(res.body.user).toBeNull()
  })

  test("me returns the caller with a token", async () => {
    const res = await api("/api/auth/me", { token: user.token })
    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(user.email)
    expect(res.raw).not.toContain("passwordHash")
  })

  test("a tampered token is refused", async () => {
    const [header, payload, signature] = user.token.split(".")
    const forged = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    forged.role = "admin"
    const swapped = Buffer.from(JSON.stringify(forged)).toString("base64url")

    const res = await api("/api/auth/me", { token: `${header}.${swapped}.${signature}` })
    expect(res.status).toBe(200)
    expect(res.body.user).toBeNull()
  })

  test("an expired token is refused", async () => {
    const [header, payload, signature] = user.token.split(".")
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    claims.exp = Math.floor(Date.now() / 1000) - 60
    const stale = Buffer.from(JSON.stringify(claims)).toString("base64url")

    const res = await api("/api/auth/me", { token: `${header}.${stale}.${signature}` })
    expect(res.body.user).toBeNull()
  })

  test("garbage in the token position is refused", async () => {
    const res = await api("/api/auth/me", { token: "not.a.jwt" })
    expect(res.status).toBe(200)
    expect(res.body.user).toBeNull()
  })
})

test.describe("Protected routes", () => {
  let user: CreatedUser

  const protectedPaths = [
    "/api/projects",
    "/api/reviews",
    "/api/leads",
    "/api/brands",
    "/api/billing",
    "/api/dashboard/stats",
    "/api/experts",
    "/api/deliverables",
  ]

  test.beforeAll(async () => {
    user = await registerUser({ name: "Route Probe" })
  })

  test.afterAll(async () => {
    await cleanupUsers(user?.email)
  })

  for (const path of protectedPaths) {
    test(`${path} refuses an anonymous caller`, async () => {
      const res = await api(path)
      expect(res.status).toBe(401)
    })
  }

  for (const path of protectedPaths) {
    test(`${path} refuses a cookie without an Authorization header`, async () => {
      // Middleware only checks that a cookie exists; the route is what actually
      // resolves the user. This proves the second layer stands on its own.
      const res = await api(path, { token: user.token, cookieOnly: true })
      expect(res.status).toBe(401)
    })
  }

  test("a valid session is accepted", async () => {
    const res = await api("/api/projects", { token: user.token })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

test.describe("Health", () => {
  test("reports status and database state", async () => {
    const res = await api("/api/health")
    expect([200, 503]).toContain(res.status)
    expect(res.body.status).toBeTruthy()
    expect(res.body.database).toMatch(/connected|not_configured|error/)
    expect(res.body.timestamp).toBeTruthy()
  })
})
