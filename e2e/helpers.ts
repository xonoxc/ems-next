import { test as base, expect, type Page } from "@playwright/test"

const TEST_USER = {
   email: "admin@ems.dev",
   password: "password123",
}

const HR_USER = {
   email: "hr@ems.dev",
   password: "password123",
}

const EMPLOYEE_USER = {
   email: "employee@ems.dev",
   password: "password123",
}

export async function loginAs(page: Page, user = TEST_USER) {
   const response = await page.request.post("/api/auth/sign-in/email", {
      data: { email: user.email, password: user.password },
   })

   if (!response.ok()) {
      throw new Error(`Sign-in failed: ${response.status()} ${await response.text()}`)
   }

   const setCookie = response.headers()["set-cookie"] ?? ""
   const match = setCookie.match(/better-auth\.session_token=([^;]+)/)
   if (match) {
      await page.context().addCookies([
         {
            name: "better-auth.session_token",
            value: match[1],
            domain: "localhost",
            path: "/",
         },
      ])
   }

   await page.goto("/dashboard")
   await page.waitForLoadState("networkidle")
}

export { TEST_USER, HR_USER, EMPLOYEE_USER }

type TestFixtures = {
   authenticatedPage: Page
   hrPage: Page
   employeePage: Page
}

export const test = base.extend<TestFixtures>({
   authenticatedPage: async ({ browser }, fixture) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      await loginAs(page, TEST_USER)
      await fixture(page)
      await context.close()
   },
   hrPage: async ({ browser }, fixture) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      await loginAs(page, HR_USER)
      await fixture(page)
      await context.close()
   },
   employeePage: async ({ browser }, fixture) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      await loginAs(page, EMPLOYEE_USER)
      await fixture(page)
      await context.close()
   },
})

export { expect }
