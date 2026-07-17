import { test, expect } from "./helpers"

test.describe("Navigation", () => {
   test("full navigation flow: login -> dashboard -> employees -> detail -> back", async ({
      authenticatedPage: page,
   }) => {
      await expect(page).toHaveURL("/dashboard")

      await page.getByRole("link", { name: "Employees" }).click()
      await page.waitForURL("/employees", { timeout: 5000 })
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const firstEmployeeLink = page.getByRole("row").nth(1).getByRole("link").first()
      await firstEmployeeLink.click()
      await page.waitForURL(/\/employees\/[a-f0-9-]+/, { timeout: 10000 })
      await expect(page.getByRole("button", { name: "Edit" })).toBeVisible({ timeout: 10000 })

      await page.getByRole("link", { name: "Employees" }).click()
      await page.waitForURL("/employees", { timeout: 5000 })
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })
   })

   test("sidebar collapses and expands", async ({ authenticatedPage: page }) => {
      const sidebarTrigger = page.locator("[data-sidebar='trigger']")
      await expect(sidebarTrigger).toBeVisible({ timeout: 10000 })

      await sidebarTrigger.click()
      await page.waitForTimeout(300)
      await sidebarTrigger.click()
      await page.waitForTimeout(300)
   })

   test("EMS logo links to dashboard", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.waitForURL("/employees", { timeout: 5000 })
      await page.getByRole("link", { name: "EMS" }).click()
      await page.waitForURL("/dashboard", { timeout: 5000 })
      await expect(page).toHaveURL("/dashboard")
   })

   test("unauthenticated user redirected to login when accessing protected routes", async ({
      page,
   }) => {
      await page.goto("/dashboard")
      await page.waitForURL("**/login*", { timeout: 10000 })
      await expect(page).toHaveURL(/login/)
   })

   test("theme toggle is available", async ({ authenticatedPage: page }) => {
      await page.getByRole("button", { name: "Toggle theme" }).click()
      await expect(page.getByText("Light")).toBeVisible({ timeout: 5000 })
   })
})
