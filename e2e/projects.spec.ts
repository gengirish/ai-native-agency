import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

/**
 * Smoke coverage for the projects pages. Behavioural coverage — creating a
 * project and watching it reach the list, wizard gating, search and tab
 * filtering — lives in project-lifecycle.spec.ts.
 */

test.describe("Projects list", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/projects")
  })

  test("shows the projects heading and a way to start a brief", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible()
    await expect(page.getByRole("link", { name: /new brief/i }).first()).toBeVisible()
  })

  test("settles into either a list or the empty state", async ({ page }) => {
    const empty = page.getByText(/no projects yet/i)
    const cards = page.locator("a[href^='/projects/']")
    await expect(empty.or(cards.first())).toBeVisible({ timeout: 30000 })
  })

  test("offers the status filter tabs", async ({ page }) => {
    for (const label of ["All", "Active", "Completed", "Draft"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible()
    }
  })
})

test.describe("Brief Builder wizard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/projects/new")
  })

  test("opens on the project type step", async ({ page }) => {
    await expect(page.getByText("Logo Design")).toBeVisible()
  })

  test("shows all five steps in the indicator", async ({ page }) => {
    for (const label of ["Type", "Details", "Brand", "Deliverables", "Review"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible()
    }
  })
})
