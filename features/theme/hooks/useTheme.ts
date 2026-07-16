"use client"

import { create } from "zustand"
import { useEffect } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeState {
   theme: Theme
   setTheme: (theme: Theme) => void
   resolvedTheme: "light" | "dark"
}

function getSystemTheme(): "light" | "dark" {
   if (typeof window === "undefined") return "light"
   return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
   const resolved = theme === "system" ? getSystemTheme() : theme
   document.documentElement.classList.toggle("dark", resolved === "dark")
   return resolved
}

export const useThemeStore = create<ThemeState>(set => ({
   theme: "system",
   resolvedTheme: "light",
   setTheme: (theme: Theme) => {
      localStorage.setItem("ems-theme", theme)
      const resolved = applyTheme(theme)
      set({ theme, resolvedTheme: resolved })
   },
}))

export function useTheme() {
   const { theme, resolvedTheme, setTheme } = useThemeStore()

   useEffect(() => {
      const stored = localStorage.getItem("ems-theme") as Theme | null
      const initial = stored ?? "system"
      const resolved = applyTheme(initial)
      useThemeStore.setState({ theme: initial, resolvedTheme: resolved })
   }, [])

   return { theme, resolvedTheme, setTheme }
}
