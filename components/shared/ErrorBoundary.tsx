"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
   children: ReactNode
   fallback?: ReactNode
   onReset?: () => void
}

interface ErrorBoundaryState {
   hasError: boolean
   error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
   constructor(props: ErrorBoundaryProps) {
      super(props)
      this.state = { hasError: false, error: null }
   }

   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error }
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("ErrorBoundary caught:", error, errorInfo)
   }

   handleReset = () => {
      this.setState({ hasError: false, error: null })
      this.props.onReset?.()
   }

   render() {
      if (this.state.hasError) {
         if (this.props.fallback) {
            return this.props.fallback
         }

         return (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card p-12 text-center">
               <AlertTriangle className="size-12 text-destructive" />
               <div>
                  <h2 className="text-lg font-semibold">Something went wrong</h2>
                  <p className="text-sm text-muted-foreground">
                     {this.state.error?.message ?? "An unexpected error occurred"}
                  </p>
               </div>
               <Button onClick={this.handleReset} variant="outline">
                  <RotateCcw className="mr-2 size-4" />
                  Try Again
               </Button>
            </div>
         )
      }

      return this.props.children
   }
}
