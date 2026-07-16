import { QueryProvider } from "@/components/providers/query-provider"
import { Sidebar } from "@/components/shared/sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <QueryProvider>
         <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-muted/50">{children}</main>
         </div>
         <Toaster />
      </QueryProvider>
   )
}
