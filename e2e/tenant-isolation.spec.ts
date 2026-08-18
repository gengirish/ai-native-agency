import { test, expect } from "@playwright/test"
import { api, cleanupUsers, loginApi, registerUser, USERS, type CreatedUser } from "./helpers"

/**
 * Tenant isolation.
 *
 * Self-serve registration always lands in the "self-serve" tenant, while the
 * seeded demo data lives in "demo-agency". That gives every test here two real
 * tenants without any fixture setup: the outsider must never see, read, or
 * modify anything belonging to the demo tenant.
 */

const DEMO_PASSWORD = "demo123"

const collectionPaths = [
  "/api/projects",
  "/api/reviews",
  "/api/leads",
  "/api/brands",
  "/api/deliverables",
  "/api/experts",
  "/api/suggestions",
  "/api/publishing",
]

function idsOf(payload: any): string[] {
  const rows = Array.isArray(payload?.data) ? payload.data : []
  return rows.map((r: any) => r?.id).filter(Boolean)
}

test.describe("An outsider cannot reach demo-tenant data", () => {
  let outsider: CreatedUser
  let insiderToken: string

  test.beforeAll(async () => {
    outsider = await registerUser({ name: "Outside Tenant" })

    const login = await loginApi(USERS.admin.email, DEMO_PASSWORD)
    if (login.status !== 200) {
      throw new Error(`demo admin login failed: ${login.status} ${login.raw}`)
    }
    insiderToken = login.body.token
  })

  test.afterAll(async () => {
    await cleanupUsers(outsider?.email)
  })

  for (const path of collectionPaths) {
    test(`${path} shares no rows across tenants`, async () => {
      const inside = await api(path, { token: insiderToken })
      const outside = await api(path, { token: outsider.token })

      expect(inside.status).toBe(200)
      expect(outside.status).toBe(200)

      const insideIds = new Set(idsOf(inside.body))
      const leaked = idsOf(outside.body).filter((id) => insideIds.has(id))

      expect(leaked, `${path} returned demo-tenant rows to another tenant`).toEqual([])
    })
  }

  test("a demo project is not readable by id", async () => {
    const inside = await api("/api/projects", { token: insiderToken })
    const projectId = idsOf(inside.body)[0]
    test.skip(!projectId, "no seeded projects to probe")

    const asOutsider = await api(`/api/projects/${projectId}`, { token: outsider.token })
    expect(asOutsider.status).toBe(404)

    const asInsider = await api(`/api/projects/${projectId}`, { token: insiderToken })
    expect(asInsider.status).toBe(200)
  })

  test("a demo project cannot be modified from outside", async () => {
    const inside = await api("/api/projects", { token: insiderToken })
    const project = (inside.body.data ?? [])[0]
    test.skip(!project, "no seeded projects to probe")

    const attack = await api(`/api/projects/${project.id}`, {
      method: "PATCH",
      token: outsider.token,
      body: { status: "delivered", priority: "low" },
    })
    expect(attack.status).toBe(404)

    // And the row is untouched.
    const after = await api(`/api/projects/${project.id}`, { token: insiderToken })
    expect(after.status).toBe(200)
    expect(after.body.data.status).toBe(project.status)
    expect(after.body.data.priority).toBe(project.priority)
  })

  test("a demo lead cannot be modified from outside", async () => {
    const inside = await api("/api/leads", { token: insiderToken })
    const lead = (inside.body.data ?? [])[0]
    test.skip(!lead, "no seeded leads to probe")

    const attack = await api(`/api/leads/${lead.id}`, {
      method: "PATCH",
      token: outsider.token,
      body: { status: "won", notes: "written by another tenant" },
    })
    expect(attack.status).toBe(404)

    const after = await api("/api/leads", { token: insiderToken })
    const reread = (after.body.data ?? []).find((l: any) => l.id === lead.id)
    expect(reread.status).toBe(lead.status)
    expect(reread.notes).toBe(lead.notes)
  })

  test("dashboard figures are scoped to the caller's tenant", async () => {
    const inside = await api("/api/dashboard/stats", { token: insiderToken })
    const outside = await api("/api/dashboard/stats", { token: outsider.token })

    expect(inside.status).toBe(200)
    expect(outside.status).toBe(200)
    // A brand-new tenant cannot legitimately report the demo tenant's numbers.
    expect(outside.raw).not.toBe(inside.raw)
  })

  test("a project created by the outsider stays invisible to the demo tenant", async () => {
    const created = await api("/api/projects", {
      method: "POST",
      token: outsider.token,
      body: {
        title: `Isolation probe ${Date.now()}`,
        type: "logo_design",
        clientName: "Outside Co",
      },
    })
    expect(created.status).toBe(201)
    const newId = created.body.data.id

    try {
      const asOutsider = await api(`/api/projects/${newId}`, { token: outsider.token })
      expect(asOutsider.status).toBe(200)

      const asInsider = await api(`/api/projects/${newId}`, { token: insiderToken })
      expect(asInsider.status).toBe(404)

      const insiderList = await api("/api/projects", { token: insiderToken })
      expect(idsOf(insiderList.body)).not.toContain(newId)
    } finally {
      // Created through the API, so remove it the same way the DB fixture would.
      const { deleteProject, hasDb } = await import("./db")
      if (hasDb()) await deleteProject(newId)
    }
  })
})
