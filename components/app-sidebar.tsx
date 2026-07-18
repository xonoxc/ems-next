"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, GitBranch, LogOut, Building2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
} from "@/components/ui/sidebar"
import { useSession } from "@/features/auth/hooks"
import { ThemeToggle } from "@/features/theme/components/ThemeToggle"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"
import { employeesQueryOptions } from "@/features/employees/api/query-options"
import { orgTreeQueryOptions } from "@/features/organization/api/query-options"

const navItems = [
   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
   { href: "/employees", label: "Employees", icon: Users, key: "employees" },
   { href: "/organization", label: "Organization", icon: GitBranch, key: "organization" },
]

export function AppSidebar() {
   const pathname = usePathname()
   const { signOut, user, refetch } = useSession()
   const queryClient = useQueryClient()

   const prefetch = (key: string) => ({
      onMouseEnter: () => {
         if (key === "dashboard") {
            queryClient.prefetchQuery(dashboardSummaryQueryOptions())
         } else if (key === "employees") {
            queryClient.prefetchQuery(
               employeesQueryOptions({
                  page: 1,
                  pageSize: 10,
                  sortBy: "createdAt",
                  sortOrder: "desc",
               })
            )
         } else if (key === "organization") {
            queryClient.prefetchQuery(orgTreeQueryOptions())
         }
      },
   })

   return (
      <Sidebar collapsible="icon">
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild className="gap-2 rounded-md">
                     <Link href="/dashboard">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                           <Building2 className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold">EMS</span>
                           <span className="truncate text-xs text-sidebar-foreground/70">
                              Employee Management
                           </span>
                        </div>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Navigation</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                     {navItems.map(item => {
                        const Icon = item.icon
                        const isActive = pathname.startsWith(item.href)
                        return (
                           <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton
                                 asChild
                                 isActive={isActive}
                                 className="rounded-md"
                                 {...prefetch(item.key)}
                              >
                                 <Link href={item.href}>
                                    <Icon className="size-4" />
                                    <span>{item.label}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        )
                     })}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarSeparator />

         <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                  <div className="flex items-center justify-between px-2 py-1.5">
                     <span className="text-xs text-sidebar-foreground/70">
                        {user?.name ?? user?.email ?? "User"}
                     </span>
                     <ThemeToggle />
                  </div>
               </SidebarMenuItem>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     onClick={() => {
                        signOut()
                     }}
                     className="w-full"
                  >
                     <LogOut className="size-4" />
                     <span>Sign Out</span>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   )
}
