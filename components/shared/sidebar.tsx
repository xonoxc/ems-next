"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, GitBranch, LogOut, Building2 } from "lucide-react"
import { useSession } from "@/features/auth/hooks"

const navItems = [
   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
   { href: "/employees", label: "Employees", icon: Users },
   { href: "/organization", label: "Organization", icon: GitBranch },
]

export function Sidebar() {
   const pathname = usePathname()
   const { signOut } = useSession()

   return (
      <aside className="flex w-64 flex-col border-r bg-background">
         <div className="flex items-center gap-2 border-b px-6 py-4">
            <Building2 className="size-6 text-primary" />
            <span className="font-semibold">EMS</span>
         </div>

         <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map(item => {
               const Icon = item.icon
               const isActive = pathname.startsWith(item.href)
               return (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                           ? "bg-primary text-primary-foreground"
                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                     )}
                  >
                     <Icon className="size-4" />
                     {item.label}
                  </Link>
               )
            })}
         </nav>

         <div className="border-t px-3 py-4">
            <button
               onClick={() => signOut()}
               className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
               <LogOut className="size-4" />
               Sign Out
            </button>
         </div>
      </aside>
   )
}
