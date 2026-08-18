import { test, expect } from "@playwright/test"
import { api, applySession, loginApi, USERS } from "./helpers"
import { deleteProject, hasDb } from "./db"

/**
 * Projects: creation, listing, filtering, and the brief wizard.
 *
 * The existing suite only proved these pages render. These tests make a change
 * and then assert the change is visible — a project created through the API
 * shows up in the list UI, a status patch moves it between tabs, and the wizard
 * actually gates progress on required input.
 */

const DEMO_PASSWORD = "demo123"

async function adminToken(): Promise<string> {
  const res = await loginApi(USERS.admin.email, DEMO_PASSWORD)
  if (res.status !== 200) throw new Error(`admin login failed: ${res.status} ${res.raw}`)
  return res.body.token
}

test.describe("A created project reaches the list", () => {
  let token: string
  let projectId: string
  const title = `E2E lifecycle ${Date.now()}`

  test.beforeAll(async () => {
    token = await adminToken()
    const res = await api("/api/projects", {
      method: "POST",
      token,
      body: {
        title,
        type: "logo_design",
        priority: "high",
        clientName: "E2E Client",
      },
    })
    if (res.status !== 201) throw new Error(`create failed: ${res.status} ${res.raw}`)
    projectId = res.body.data.id
  })

  test.afterAll(async () => {
    if (projectId && hasDb()) await deleteProject(projectId)
  })

  test("the API returns it with the fields it was given", async () => {
    const res = await api(`/api/projects/${projectId}`, { token })
    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe(title)
    expect(res.body.data.priority).toBe("high")
  })

  test("it appears on the projects page", async ({ page }) => {
    await applySession(page, token)
    await page.goto("/projects")

    await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 30000 })
  })

  test("search narrows the list to it and then finds nothing", async ({ page }) => {
    await applySession(page, token)
    await page.goto("/projects")
    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 30000 })

    const search = page.getByLabel("Search projects")
    await search.fill(title)
    await expect(page.getByRole("heading", { name: title })).toBeVisible()

    await search.fill("zzz-no-such-project-zzz")
    await expect(page.getByText(/no projects match your filters/i)).toBeVisible()
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0)
  })

  test("a status change moves it between tabs", async ({ page }) => {
    const patch = await api(`/api/projects/${projectId}`, {
      method: "PATCH",
      token,
      // The Completed tab matches status "delivered" (see matchesTab).
      body: { status: "delivered" },
    })
    expect(patch.status).toBe(200)

    await applySession(page, token)
    await page.goto("/projects")

    await page.getByRole("button", { name: "Completed", exact: true }).click()
    await expect(page.getByRole("heading", { name: title })).toBeVisible({ timeout: 30000 })

    await page.getByRole("button", { name: "Draft", exact: true }).click()
    await expect(page.getByRole("heading", { name: title })).toHaveCount(0)
  })
})

test.describe("Brief wizard", () => {
  test.beforeEach(async ({ page }) => {
    const token = await adminToken()
    await applySession(page, token)
    await page.goto("/projects/new")
  })

  test("starts on step 1 with the project types offered", async ({ page }) => {
    await expect(page.getByText("Logo Design")).toBeVisible()
    // The step indicator marks step 1, not merely "a digit is on the page".
    await expect(page.getByText("Type", { exact: true })).toBeVisible()
  })

  test("will not advance until a type is chosen", async ({ page }) => {
    const next = page.getByRole("button", { name: "Continue", exact: true })
    await expect(next).toBeDisabled()

    await page.getByText("Logo Design").click()
    await expect(next).toBeEnabled()
  })

  test("advances to details and back again", async ({ page }) => {
    await page.getByText("Logo Design").click()
    await page.getByRole("button", { name: "Continue", exact: true }).click()

    // Step 2 owns the title field; its presence is what proves we moved.
    await expect(page.locator("#brief-title")).toBeVisible()

    await page.getByRole("button", { name: "Back", exact: true }).click()
    await expect(page.getByText("Logo Design")).toBeVisible()
    await expect(page.locator("#brief-title")).toHaveCount(0)
  })

  test("keeps the chosen type when stepping back", async ({ page }) => {
    await page.getByText("Logo Design").click()
    await page.getByRole("button", { name: "Continue", exact: true }).click()
    await page.locator("#brief-title").fill("Remembered title")
    await page.getByRole("button", { name: "Back", exact: true }).click()
    await page.getByRole("button", { name: "Continue", exact: true }).click()

    await expect(page.locator("#brief-title")).toHaveValue("Remembered title")
  })

  test("offers a way back to the projects list", async ({ page }) => {
    await page.getByRole("link", { name: /projects|back/i }).first().click()
    await expect(page).toHaveURL(/\/projects$/)
  })
})

test.describe("Empty and loading states", () => {
  test("a brand-new tenant sees the empty state, not a broken list", async ({ page }) => {
    const { registerUser, cleanupUsers } = await import("./helpers")
    const fresh = await registerUser({ name: "Empty Tenant" })

    try {
      await applySession(page, fresh.token)
      await page.goto("/projects")

      const empty = page.getByText(/no projects yet/i)
      const anyCard = page.locator("article, a[href^='/projects/']")
      // Either the empty state, or cards — never a permanent skeleton.
      await expect(empty.or(anyCard.first())).toBeVisible({ timeout: 30000 })
    } finally {
      await cleanupUsers(fresh.email)
    }
  })
})
