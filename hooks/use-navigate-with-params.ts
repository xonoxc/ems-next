"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * Returns a `navigateTo(path)` function that appends the current
 * URL query params to the target path before pushing it to the router.
 *
 * This ensures filters survive back/forward navigation because they are
 * always present in the URL that gets pushed to the history stack.
 */
export function useNavigateWithParams() {
   const router = useRouter()
   const searchParams = useSearchParams()

   const navigateTo = useCallback(
      (path: string) => {
         const qs = searchParams.toString()
         router.push(qs ? `${path}?${qs}` : path)
      },
      [router, searchParams]
   )

   return { navigateTo }
}
