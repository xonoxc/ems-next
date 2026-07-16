import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
   return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
         <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
         <div className="text-center">
            <h2 className="text-lg font-semibold">Page Not Found</h2>
            <p className="text-sm text-muted-foreground">
               The page you&apos;re looking for doesn&apos;t exist.
            </p>
         </div>
         <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
         </Button>
      </div>
   )
}
