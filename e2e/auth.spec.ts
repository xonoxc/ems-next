import { test, expect } from "./helpers"

test.describe("Authentication", () => {
   test("landing page renders with sign in and dashboard links", async ({ page }) => {
      await page.goto("/")
      await expect(page.getByRole("heading", { name: "Employee Management System" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Sign In" })).toBeVisible()
      await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible()
   })

   test("navigating to sign in link goes to login page", async ({ page }) => {
      await page.goto("/")
      await page.getByRole("link", { name: "Sign In" }).click()
      await page.waitForURL("**/login")
      await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()
      await expect(page.getByLabel("Email")).toBeVisible()
      await expect(page.getByLabel("Password")).toBeVisible()
   })

   test("login form validates required fields", async ({ page }) => {
      await page.goto("/login")
      await page.waitForLoadState("networkidle")
      await page.getByRole("button", { name: "Sign In" }).click()
      await expect(page.getByText("Please enter a valid email")).toBeVisible()
   })

   test("login with invalid credentials shows error", async ({ page }) => {
      await page.goto("/login")
      await page.waitForLoadState("networkidle")
      await page.getByLabel("Email").fill("wrong@email.com")
      await page.getByLabel("Password").fill("wrongpassword123")
      await page.getByRole("button", { name: "Sign In" }).click()
      await expect(page.getByText(/invalid|error|incorrect|wrong|unauthorized/i)).toBeVisible({
         timeout: 10000,
      })
   })

   test("login with valid credentials redirects to dashboard", async ({ page }) => {
      await page.goto("/login")
      await page.waitForLoadState("networkidle")
      await page.getByLabel("Email").fill("admin@ems.dev")
      await page.getByLabel("Password").fill("password123")
      await page.getByRole("button", { name: "Sign In" }).click()
      await page.waitForURL("**/dashboard", { timeout: 15000 })
      await expect(page).toHaveURL(/dashboard/)
   })

   test("already logged in user is redirected from login to dashboard", async ({ page }) => {
      const response = await page.request.post("/api/auth/sign-in/email", {
         data: { email: "admin@ems.dev", password: "password123" },
      })
      const body = await response.json()
      if (body.token) {
         await page.context().addCookies([
            {
               name: "better-auth.session_token",
               value: body.token,
               domain: "localhost",
               path: "/",
            },
         ])
      }

      await page.goto("/login")
      await page.waitForURL("**/dashboard", { timeout: 10000 })
      await expect(page).toHaveURL(/dashboard/)
   })

   test("sign out redirects to login page", async ({ authenticatedPage: page }) => {
      await page.goto("/employees")
      await page.waitForLoadState("networkidle")

      await page.getByText("Sign Out").click()
      await page.waitForURL("**/login", { timeout: 10000 })
   })

   test("unauthenticated user redirected to login when accessing protected routes", async ({
      page,
   }) => {
      await page.goto("/dashboard")
      await page.waitForURL("**/login*", { timeout: 10000 })
      await expect(page).toHaveURL(/login/)
   })
})
