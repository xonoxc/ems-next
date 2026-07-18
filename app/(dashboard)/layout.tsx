import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-muted px-4">
               <SidebarTrigger className="-ml-1" />
               <div className="py-2 h-full">
                  <Separator orientation="vertical" className="mr-2 h-full" />
               </div>
            </header>
            <main className="flex-1 overflow-y-auto bg-muted p-6">{children}</main>
         </SidebarInset>
      </SidebarProvider>
   )
}
