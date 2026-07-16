import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { QueryProvider } from "@/components/providers/query-provider"
import "./globals.css"

const inter = Inter({
   variable: "--font-sans",
   subsets: ["latin"],
})

export const metadata: Metadata = {
   title: "Employee Management System",
   description: "Manage your organization's employees, departments, and reporting structure",
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang="en" className={`${inter.variable} h-full antialiased`}>
         <body className="h-full flex flex-col">
            <QueryProvider>{children}</QueryProvider>
         </body>
      </html>
   )
}
