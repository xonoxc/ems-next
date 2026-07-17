import { test, expect } from "./helpers"
import type { Page } from "@playwright/test"

async function createAndGetEmployee(page: Page): Promise<string> {
   const uniqueEmail = `detail-test-${Date.now()}@example.com`

   await page.goto("/employees")
   await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })
   await page.getByRole("button", { name: "Add Employee" }).click()

   await page.getByLabel("First Name").fill("DetailTest")
   await page.getByLabel("Last Name").fill("Employee")
   await page.getByLabel("Email").fill(uniqueEmail)
   await page.getByLabel("Designation").selectOption("Software Engineer")
   await page.getByLabel("Salary").fill("60000")
   await page.getByLabel("Joining Date").fill("2024-01-15")
   await page.getByRole("button", { name: "Create Employee" }).click()
   await expect(page.getByText("Employee created successfully")).toBeVisible({ timeout: 10000 })

   await page.getByPlaceholder("Search employees...").fill(uniqueEmail)
   await expect(page.getByText(uniqueEmail)).toBeVisible({ timeout: 10000 })

   await page.getByRole("row").nth(1).getByRole("link").first().click()
   await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })

   return uniqueEmail
}

test.describe("Employee Detail", () => {
   test("navigating to employee detail page shows employee info", async ({
      authenticatedPage: page,
   }) => {
      await createAndGetEmployee(page)

      await expect(page.getByText("Email")).toBeVisible()
      await expect(page.getByText("Phone")).toBeVisible()
      await expect(page.getByText("Department")).toBeVisible()
      await expect(page.getByText("Designation")).toBeVisible()
      await expect(page.getByText("Salary")).toBeVisible()
      await expect(page.getByText("Joining Date")).toBeVisible()
   })

   test("employee detail shows action buttons", async ({ authenticatedPage: page }) => {
      await createAndGetEmployee(page)

      await expect(page.getByRole("button", { name: "Edit" })).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole("button", { name: "Delete" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Change Manager" })).toBeVisible()
   })

   test("employee detail shows status badge", async ({ authenticatedPage: page }) => {
      await createAndGetEmployee(page)

      const statusBadge = page.locator('[data-slot="badge"]').first()
      await expect(statusBadge).toBeVisible()
   })

   test("edit button on detail page opens edit form", async ({ authenticatedPage: page }) => {
      await createAndGetEmployee(page)

      await page.getByRole("button", { name: "Edit" }).click()
      await expect(page.getByText("Edit Employee")).toBeVisible()
      await expect(page.getByRole("button", { name: "Update Employee" })).toBeVisible()
   })

   test("delete button on detail page opens delete dialog", async ({ authenticatedPage: page }) => {
      await createAndGetEmployee(page)

      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Delete Employee")).toBeVisible()
      await expect(page.getByText("Are you sure")).toBeVisible()
   })

   test("cancel edit closes form", async ({ authenticatedPage: page }) => {
      await createAndGetEmployee(page)

      await page.getByRole("button", { name: "Edit" }).click()
      await expect(page.getByText("Edit Employee")).toBeVisible()
      await page.getByRole("button", { name: "Cancel" }).click()
      await expect(page.getByText("Edit Employee")).not.toBeVisible()
   })

   test("employee detail shows employee ID", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const firstRow = page.getByRole("row").nth(1)
      const empIdCell = firstRow.getByRole("cell").nth(1)
      const empId = await empIdCell.textContent()

      await firstRow.getByRole("link").first().click()
      await expect(page.getByText(`ID: ${empId}`)).toBeVisible({ timeout: 10000 })
   })
})
