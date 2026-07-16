import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

const publicPaths = ["/", "/login", "/api/auth"]

const staticFilePattern = /\.(ico|png|jpg|jpeg|svg|css|js|woff2?|ttf|eot)$/

function isPublicPath(pathname: string): boolean {
   return publicPaths.some(p => pathname === p || pathname.startsWith(p + "/"))
}

export function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl

   if (staticFilePattern.test(pathname)) {
      return NextResponse.next()
   }

   if (pathname.startsWith("/_next/")) {
      return NextResponse.next()
   }

   if (isPublicPath(pathname)) {
      if (pathname.startsWith("/api/auth")) {
         const ip =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            request.headers.get("x-real-ip") ??
            "unknown"
         const result = rateLimit(`auth:${ip}`, 10, 60_000)
         if (!result.allowed) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 })
         }
         return NextResponse.next()
      }

      const authCookie = request.cookies.get("better-auth.session_token")
      if (authCookie && (pathname === "/" || pathname === "/login")) {
         return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next()
   }

   const authCookie = request.cookies.get("better-auth.session_token")
   if (!authCookie) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
   }

   return NextResponse.next()
}

export const config = {
   matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}
