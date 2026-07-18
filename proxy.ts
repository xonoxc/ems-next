import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function getAuthCookie(request: NextRequest) {
   return (
      request.cookies.get("__Secure-better-auth.session_token") ??
      request.cookies.get("better-auth.session_token")
   )
}

const publicPaths = ["/", "/login", "/api/auth"]

function isPublicPath(pathname: string): boolean {
   return publicPaths.some(p => pathname === p || pathname.startsWith(p + "/"))
}

export function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl

   if (pathname.startsWith("/_next/") || pathname.includes(".")) {
      return NextResponse.next()
   }

   if (isPublicPath(pathname)) {
      if (pathname.startsWith("/api/auth")) {
         return NextResponse.next()
      }

      const authCookie = getAuthCookie(request)
      if (authCookie && (pathname === "/" || pathname === "/login")) {
         return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next()
   }

   const authCookie = getAuthCookie(request)
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
