"use client"

import { useEffect, type ReactNode } from "react"
import { useTheme } from "@/features/theme/hooks/useTheme"

export function ThemeProvider({ children }: { children: ReactNode }) {
   const { theme } = useTheme()

   useEffect(() => {
      document.documentElement.classList.toggle("dark", theme === "dark")
   }, [theme])

   return <>{children}</>
}
