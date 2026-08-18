import { test, expect } from "@playwright/test"
import { loginAs } from "./helpers"

/**
 * Mobile navigation drawer.
 *
 * The desktop sidebar is hidden below the lg breakpoint and replaced by a
 * drawer with a focus trap, an Escape handler, and scroll locking. None of that
 * was covered, and all of it is easy to break from a styling change.
 *
 * This spec runs under the "mobile" Playwright project (see playwright.config.ts),
 * which supplies the small viewport.
 */

test.describe("Mobile drawer", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, "admin")
    await page.goto("/dashboard")
  })

  test("the desktop sidebar is replaced by a menu button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /open navigation menu/i })).toBeVisible()

    // The drawer exists in the DOM but must not be exposed while closed.
    const drawer = page.getByRole("dialog", { name: /main navigation/i })
    await expect(drawer).toBeHidden()
  })

  test("opens, navigates, and closes on selection", async ({ page }) => {
    await page.getByRole("button", { name: /open navigation menu/i }).click()

    const drawer = page.getByRole("dialog", { name: /main navigation/i })
    await expect(drawer).toBeVisible()

    await drawer.getByRole("link", { name: /all projects/i }).click()

    await expect(page).toHaveURL(/\/projects/)
    // Route changes must dismiss the drawer, or the next page is unusable.
    await expect(drawer).toBeHidden()
  })

  test("closes on Escape", async ({ page }) => {
    await page.getByRole("button", { name: /open navigation menu/i }).click()
    const drawer = page.getByRole("dialog", { name: /main navigation/i })
    await expect(drawer).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(drawer).toBeHidden()
  })

  test("closes via its own close button", async ({ page }) => {
    await page.getByRole("button", { name: /open navigation menu/i }).click()
    await page.getByRole("button", { name: /close navigation menu/i }).click()

    await expect(page.getByRole("dialog", { name: /main navigation/i })).toBeHidden()
  })

  test("moves focus into the drawer when it opens", async ({ page }) => {
    await page.getByRole("button", { name: /open navigation menu/i }).click()

    const drawer = page.getByRole("dialog", { name: /main navigation/i })
    await expect(drawer).toBeVisible()

    const focusInsideDrawer = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return !!dialog && !!document.activeElement && dialog.contains(document.activeElement)
    })
    expect(focusInsideDrawer).toBe(true)
  })

  test("locks background scrolling while open", async ({ page }) => {
    const before = await page.evaluate(() => document.body.style.overflow)
    expect(before).not.toBe("hidden")

    await page.getByRole("button", { name: /open navigation menu/i }).click()
    await expect(page.getByRole("dialog", { name: /main navigation/i })).toBeVisible()

    const during = await page.evaluate(() => document.body.style.overflow)
    expect(during).toBe("hidden")

    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog", { name: /main navigation/i })).toBeHidden()
    const after = await page.evaluate(() => document.body.style.overflow)
    expect(after).not.toBe("hidden")
  })

})

test.describe("Drawer contents respect the caller's role", () => {
  // Deliberately outside the admin beforeEach above: stacking two sessions on
  // one page relies on init-script ordering, which is not worth depending on.
  test("a client sees no admin-only links", async ({ page }) => {
    await loginAs(page, "client")
    await page.goto("/dashboard")
    await page.getByRole("button", { name: /open navigation menu/i }).click()

    const drawer = page.getByRole("dialog", { name: /main navigation/i })
    await expect(drawer.getByRole("link", { name: /dashboard/i })).toBeVisible()
    await expect(drawer.getByRole("link", { name: /crm|sales/i })).toHaveCount(0)
  })
})

test.describe("Key pages fit a phone", () => {
  const paths = ["/dashboard", "/projects", "/login", "/forgot-password"]

  for (const path of paths) {
    test(`${path} does not scroll sideways`, async ({ page }) => {
      if (path !== "/login" && path !== "/forgot-password") {
        await loginAs(page, "admin")
      }
      await page.goto(path)
      // Let the first paint settle before measuring.
      await expect(page.locator("body")).toBeVisible()

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        return doc.scrollWidth - doc.clientWidth
      })
      // A couple of pixels of rounding is fine; a runaway element is not.
      expect(overflow).toBeLessThanOrEqual(2)
    })
  }
})
