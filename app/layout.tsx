import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { QueryProvider } from "@/components/providers/query-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
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
      <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
         <head>
            <script
               dangerouslySetInnerHTML={{
                  __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
               }}
            />
         </head>
         <body className="h-full flex flex-col" suppressHydrationWarning>
            <TooltipProvider>
               <NuqsAdapter>
                  <QueryProvider>{children}</QueryProvider>
               </NuqsAdapter>
            </TooltipProvider>
            <Toaster />
         </body>
      </html>
   )
}
