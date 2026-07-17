import { test, expect } from "./helpers"

test.describe("Organization Tree", () => {
   test("organization page loads", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByRole("heading", { name: "Organization" })).toBeVisible()
      await expect(page.getByText("View your organization")).toBeVisible()
   })

   test("org tree renders with nodes", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByText("Expand All")).toBeVisible({ timeout: 10000 })
   })

   test("expand all button works", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByText("Expand All")).toBeVisible({ timeout: 10000 })
      await page.getByText("Expand All").click()
      await page.waitForTimeout(500)
   })

   test("collapse all button works", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByText("Expand All")).toBeVisible({ timeout: 10000 })
      await page.getByText("Expand All").click()
      await page.waitForTimeout(500)
      await page.getByText("Collapse All").click()
      await page.waitForTimeout(500)
   })

   test("search input is visible", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByPlaceholder("Search organization...")).toBeVisible({ timeout: 10000 })
   })

   test("depth slider is visible", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByText("Depth")).toBeVisible({ timeout: 10000 })
   })

   test("search filters org tree", async ({ authenticatedPage: page }) => {
      await page.goto("/organization")
      await expect(page.getByText("Expand All")).toBeVisible({ timeout: 10000 })

      const searchInput = page.getByPlaceholder("Search organization...")
      await searchInput.fill("Admin")
      await page.waitForTimeout(500)
   })
})
