import { test, expect } from "./helpers"

test.describe("Employee CRUD Operations", () => {
   test("create and then edit an employee", async ({ authenticatedPage: page }) => {
      const uniqueEmail = `test-crud-${Date.now()}@example.com`

      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()

      await page.getByLabel("First Name").fill("Crud")
      await page.getByLabel("Last Name").fill("TestUser")
      await page.getByLabel("Email").fill(uniqueEmail)
      await page.getByLabel("Designation").selectOption("Software Engineer")
      await page.getByLabel("Salary").fill("80000")
      await page.getByLabel("Joining Date").fill("2024-06-01")
      await page.getByRole("button", { name: "Create Employee" }).click()
      await expect(page.getByText("Employee created successfully")).toBeVisible({ timeout: 10000 })

      await page.getByPlaceholder("Search employees...").fill(uniqueEmail)
      await expect(page.getByText(uniqueEmail)).toBeVisible({ timeout: 10000 })

      const editBtn = page.getByRole("row").nth(1).getByRole("button").first()
      await editBtn.click()
      await expect(page.getByText("Edit Employee")).toBeVisible()

      await page.getByLabel("Designation").selectOption("Senior Software Engineer")
      await page.getByRole("button", { name: "Update Employee" }).click()
      await expect(page.getByText("Employee updated successfully")).toBeVisible({ timeout: 10000 })
   })

   test("create and delete an employee", async ({ authenticatedPage: page }) => {
      const uniqueEmail = `test-delete-${Date.now()}@example.com`

      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()

      await page.getByLabel("First Name").fill("Delete")
      await page.getByLabel("Last Name").fill("Me")
      await page.getByLabel("Email").fill(uniqueEmail)
      await page.getByLabel("Designation").selectOption("HR Coordinator")
      await page.getByLabel("Salary").fill("30000")
      await page.getByLabel("Joining Date").fill("2024-03-01")
      await page.getByRole("button", { name: "Create Employee" }).click()
      await expect(page.getByText("Employee created successfully")).toBeVisible({ timeout: 10000 })

      await page.getByPlaceholder("Search employees...").fill(uniqueEmail)
      await expect(page.getByText(uniqueEmail)).toBeVisible({ timeout: 10000 })

      const deleteBtn = page.getByRole("row").nth(1).getByRole("button").last()
      await deleteBtn.click()
      await expect(page.getByText("Are you sure")).toBeVisible()
      await page.getByRole("button", { name: "Delete" }).click()
      await expect(page.getByText("Employee deleted successfully")).toBeVisible({ timeout: 10000 })
   })

   test("employee list pagination works", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      const pageInfo = page.getByText(/Page \d+ of \d+/)
      if (await pageInfo.isVisible()) {
         await page.getByRole("button", { name: "Next", exact: true }).click()
         await page.waitForTimeout(500)
         await expect(page.getByText(/Page 2 of/)).toBeVisible({ timeout: 5000 })

         await page.getByRole("button", { name: "Previous" }).click()
         await page.waitForTimeout(500)
         await expect(page.getByText(/Page 1 of/)).toBeVisible({ timeout: 5000 })
      }
   })

   test("employee list reset filters works", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await expect(page.getByRole("table")).toBeVisible({ timeout: 10000 })

      await page.getByPlaceholder("Search employees...").fill("zzznonexistent")
      await page.waitForTimeout(500)

      const resetBtn = page.getByRole("button", { name: "Reset" })
      if (await resetBtn.isVisible()) {
         await resetBtn.click()
         await expect(page.getByPlaceholder("Search employees...")).toHaveValue("")
      }
   })

   test("edit employee from detail page", async ({ authenticatedPage: page }) => {
      const uniqueEmail = `test-detail-edit-${Date.now()}@example.com`

      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()

      await page.getByLabel("First Name").fill("Detail")
      await page.getByLabel("Last Name").fill("Edit")
      await page.getByLabel("Email").fill(uniqueEmail)
      await page.getByLabel("Designation").selectOption("HR Coordinator")
      await page.getByLabel("Salary").fill("30000")
      await page.getByLabel("Joining Date").fill("2024-06-01")
      await page.getByRole("button", { name: "Create Employee" }).click()
      await expect(page.getByText("Employee created successfully")).toBeVisible({ timeout: 10000 })

      await page.getByPlaceholder("Search employees...").fill(uniqueEmail)
      await expect(page.getByText(uniqueEmail)).toBeVisible({ timeout: 10000 })

      await page.getByRole("row").nth(1).getByRole("link").first().click()
      await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: "Edit" }).click()
      await expect(page.getByText("Edit Employee")).toBeVisible()

      await page.getByLabel("Phone").clear()
      await page.getByLabel("Phone").fill("+15551234567")
      await page.getByRole("button", { name: "Update Employee" }).click()
      await expect(page.getByText("Employee updated")).toBeVisible({ timeout: 10000 })
   })

   test("delete employee from detail page redirects to list", async ({
      authenticatedPage: page,
   }) => {
      const uniqueEmail = `test-del-detail-${Date.now()}@example.com`

      await page.goto("/employees")
      await page.getByRole("button", { name: "Add Employee" }).click()

      await page.getByLabel("First Name").fill("Detail")
      await page.getByLabel("Last Name").fill("Delete")
      await page.getByLabel("Email").fill(uniqueEmail)
      await page.getByLabel("Designation").selectOption("HR Coordinator")
      await page.getByLabel("Salary").fill("25000")
      await page.getByLabel("Joining Date").fill("2024-02-01")
      await page.getByRole("button", { name: "Create Employee" }).click()
      await expect(page.getByText("Employee created successfully")).toBeVisible({ timeout: 10000 })

      await page.getByPlaceholder("Search employees...").fill(uniqueEmail)
      await expect(page.getByText(uniqueEmail)).toBeVisible({ timeout: 10000 })

      const firstRow = page.getByRole("row").nth(1)
      await firstRow.getByRole("link").first().click()
      await expect(page.locator("h1")).toBeVisible({ timeout: 10000 })

      await page.getByRole("button", { name: "Delete" }).click()
      await page.getByRole("button", { name: "Delete" }).last().click()
      await expect(page.getByText("Employee deleted")).toBeVisible({ timeout: 10000 })
      await page.waitForURL("/employees", { timeout: 5000 })
   })
})
