"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function Error({
   error,
   reset,
}: {
   error: Error & { digest?: string }
   reset: () => void
}) {
   return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
         <AlertTriangle className="size-12 text-destructive" />
         <div className="text-center">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">{error.message}</p>
         </div>
         <Button onClick={reset} variant="outline">
            <RotateCcw className="mr-2 size-4" />
            Try Again
         </Button>
      </div>
   )
}
