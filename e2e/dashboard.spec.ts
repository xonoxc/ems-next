import { test, expect } from "./helpers"

test.describe("Dashboard", () => {
   test("dashboard page loads and shows stats cards", async ({ authenticatedPage: page }) => {
      await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible({ timeout: 10000 })
      await expect(page.getByText("Total Employees")).toBeVisible()
      await expect(page.getByText("Active Employees")).toBeVisible()
      await expect(page.getByText("Departments")).toBeVisible()
   })

   test("dashboard shows recent hires stat", async ({ authenticatedPage: page }) => {
      await expect(page.getByText("Recent Hires")).toBeVisible({ timeout: 10000 })
   })

   test("dashboard shows department distribution", async ({ authenticatedPage: page }) => {
      await expect(page.getByText("Department Distribution")).toBeVisible({ timeout: 10000 })
   })

   test("dashboard shows recent activity", async ({ authenticatedPage: page }) => {
      await expect(page.getByText("Recent Activity")).toBeVisible({ timeout: 10000 })
   })

   test("sidebar navigation is visible", async ({ authenticatedPage: page }) => {
      await expect(page.getByText("EMS")).toBeVisible()
      await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Employees" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Organization" })).toBeVisible()
   })

   test("sidebar shows user name", async ({ authenticatedPage: page }) => {
      await expect(page.getByRole("heading", { name: /Welcome/ })).toContainText("Admin User", {
         timeout: 10000,
      })
   })

   test("sidebar navigation to employees page", async ({ authenticatedPage: page }) => {
      await page.getByRole("link", { name: "Employees" }).click()
      await page.waitForURL("**/employees", { timeout: 5000 })
      await expect(page).toHaveURL(/employees/)
   })

   test("sidebar navigation to organization page", async ({ authenticatedPage: page }) => {
      await page.getByRole("link", { name: "Organization" }).click()
      await page.waitForURL("**/organization", { timeout: 5000 })
      await expect(page).toHaveURL(/organization/)
   })

   test("dashboard link in sidebar navigates to dashboard", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.getByRole("link", { name: "Dashboard" }).click()
      await page.waitForURL("**/dashboard", { timeout: 5000 })
      await expect(page).toHaveURL(/dashboard/)
   })
})
