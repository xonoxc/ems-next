import { test, expect } from "./helpers"

test.describe("Employee List", () => {
   test("employees page loads with table", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("heading", { name: "Employees" })).toBeVisible()
      await expect(page.getByText("Manage your organization")).toBeVisible()
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })
   })

   test("employee table shows columns", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole("columnheader", { name: "Employee" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "ID" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Department" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Salary" })).toBeVisible()
      await expect(page.getByRole("columnheader", { name: "Actions" })).toBeVisible()
   })

   test("employee table has rows with employee data", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })
      const rows = page.getByRole("row")
      await expect(rows.first()).toBeVisible()
      expect(await rows.count()).toBeGreaterThan(1)
   })

   test("search filters employees", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const searchInput = page.getByPlaceholder("Search employees...")
      await searchInput.fill("Admin")
      await page.waitForTimeout(500)

      const rows = page.getByRole("row")
      const count = await rows.count()
      expect(count).toBeLessThanOrEqual(11)
   })

   test("Add Employee button is visible", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("button", { name: "Add Employee" })).toBeVisible()
   })

   test("clicking Add Employee opens create form modal", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()
      await expect(page.getByRole("heading", { name: "Add Employee" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Create Employee" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
   })

   test("create form has all required fields", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()
      await expect(page.getByLabel("First Name")).toBeVisible()
      await expect(page.getByLabel("Last Name")).toBeVisible()
      await expect(page.getByLabel("Email")).toBeVisible()
      await expect(page.getByLabel("Phone")).toBeVisible()
      await expect(page.getByLabel("Department")).toBeVisible()
      await expect(page.getByLabel("Designation")).toBeVisible()
      await expect(page.getByLabel("Salary")).toBeVisible()
      await expect(page.getByLabel("Joining Date")).toBeVisible()
      await expect(page.getByLabel("Status")).toBeVisible()
   })

   test("cancel button closes create form modal", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()
      await expect(page.getByRole("button", { name: "Create Employee" })).toBeVisible()
      await page.getByRole("button", { name: "Cancel" }).first().click()
      await expect(page.getByRole("button", { name: "Create Employee" })).not.toBeVisible()
   })

   test("clicking employee name navigates to detail page", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const firstEmployeeLink = page.getByRole("row").nth(1).getByRole("link").first()
      await firstEmployeeLink.click()
      await expect(page).toHaveURL(/\/employees\/[a-f0-9-]+/, { timeout: 5000 })
   })

   test("edit button opens edit form modal", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const editButton = page.getByRole("row").nth(1).getByRole("button").first()
      await editButton.click()
      await expect(page.getByText("Edit Employee")).toBeVisible()
      await expect(page.getByRole("button", { name: "Update Employee" })).toBeVisible()
   })

   test("delete button opens delete confirmation dialog", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const deleteButton = page.getByRole("row").nth(1).getByRole("button").last()
      await deleteButton.click()
      await expect(page.getByText("Delete Employee")).toBeVisible()
      await expect(page.getByText("Are you sure")).toBeVisible()
      await expect(page.getByRole("button", { name: "Delete" })).toBeVisible()
      await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible()
   })

   test("cancel delete closes dialog", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const deleteButton = page.getByRole("row").nth(1).getByRole("button").last()
      await deleteButton.click()
      await expect(page.getByText("Delete Employee")).toBeVisible()
      await page.getByRole("button", { name: "Cancel" }).click()
      await expect(page.getByText("Delete Employee")).not.toBeVisible()
   })

   test("create employee with valid data", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()

      await page.getByLabel("First Name").fill("Test")
      await page.getByLabel("Last Name").fill("E2E User")
      await page.getByLabel("Email").fill(`test-e2e-${Date.now()}@example.com`)
      await page.getByLabel("Designation").selectOption("Software Engineer")
      await page.getByLabel("Salary").fill("75000")
      await page.getByLabel("Joining Date").fill("2024-01-15")

      await page.getByRole("button", { name: "Create Employee" }).click()

      await expect(page.getByText("Employee created successfully")).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole("button", { name: "Create Employee" })).not.toBeVisible()
   })

   test("create employee with invalid data shows validation errors", async ({
      authenticatedPage: page,
   }) => {
      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()

      await page.getByLabel("Salary").fill("-100")
      await page.getByRole("button", { name: "Create Employee" }).click()

      await expect(page.getByText("Required")).toBeVisible()
   })

   test("search with no results shows empty state", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      await page.getByPlaceholder("Search employees...").fill("zzzznonexistent99999")
      await page.waitForTimeout(500)
      await expect(page.getByText("No employees found")).toBeVisible({ timeout: 5000 })
   })
})
