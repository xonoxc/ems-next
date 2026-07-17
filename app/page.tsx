import Link from "next/link"
import { Download, LogIn, Shield, UserCheck, User } from "lucide-react"

const demoAccounts = [
   {
      email: "admin@ems.dev",
      password: "password123",
      role: "Super Admin",
      icon: Shield,
      description: "Full access to all features and settings",
   },
   {
      email: "hr@ems.dev",
      password: "password123",
      role: "HR Manager",
      icon: UserCheck,
      description: "Manage employees, departments, and org structure",
   },
   {
      email: "employee@ems.dev",
      password: "password123",
      role: "Employee",
      icon: User,
      description: "View profile and reporting structure",
   },
]

export default function Home() {
   return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background px-4 py-12">
         <main className="flex flex-col items-center gap-10 max-w-2xl w-full">
            <div className="text-center space-y-3">
               <h1 className="text-4xl font-bold text-foreground">Employee Management System</h1>
               <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Manage your organization&apos;s employees, departments, and reporting structure.
               </p>
            </div>

            <div className="flex gap-4">
               <Link
                  href="/login"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
               >
                  <LogIn className="size-4" />
                  Sign In
               </Link>
               <a
                  href="/sample-employees.csv"
                  className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors inline-flex items-center gap-2"
               >
                  <Download className="size-4" />
                  Sample CSV for testing CSV import
               </a>
            </div>

            <div className="w-full space-y-3">
               <h2 className="text-sm font-medium text-muted-foreground text-center uppercase tracking-wide">
                  Demo Accounts
               </h2>
               <div className="grid gap-3 sm:grid-cols-3">
                  {demoAccounts.map(account => {
                     const Icon = account.icon
                     return (
                        <div
                           key={account.email}
                           className="border border-border rounded-lg p-4 space-y-2"
                        >
                           <div className="flex items-center gap-2">
                              <Icon className="size-4 text-primary" />
                              <span className="font-medium text-sm">{account.role}</span>
                           </div>
                           <p className="text-xs text-muted-foreground">{account.description}</p>
                           <div className="space-y-1 text-xs">
                              <p className="font-mono text-foreground">{account.email}</p>
                              <p className="text-muted-foreground">Password: {account.password}</p>
                           </div>
                           <Link
                              href={`/login?email=${encodeURIComponent(account.email)}&password=${encodeURIComponent(account.password)}`}
                              className="text-xs text-primary hover:underline inline-block mt-1"
                           >
                              Sign in as {account.role} →
                           </Link>
                        </div>
                     )
                  })}
               </div>
            </div>
         </main>
      </div>
   )
}
