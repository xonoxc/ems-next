import Link from "next/link"

export default function Home() {
   return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background">
         <main className="flex flex-col items-center gap-8 text-center px-4">
            <h1 className="text-4xl font-bold text-foreground">
               Employee Management System
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
               Manage your organization&apos;s employees, departments, and reporting
               structure.
            </p>
            <div className="flex gap-4">
               <Link
                  href="/login"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
               >
                  Sign In
               </Link>
               <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
               >
                  Dashboard
               </Link>
            </div>
         </main>
      </div>
   )
}
