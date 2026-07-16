"use client"

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
   open: boolean
   title: string
   description: string
   confirmLabel?: string
   cancelLabel?: string
   variant?: "default" | "destructive"
   onConfirm: () => void
   onCancel: () => void
   isPending?: boolean
}

export function ConfirmDialog({
   open,
   title,
   description,
   confirmLabel = "Confirm",
   cancelLabel = "Cancel",
   variant = "default",
   onConfirm,
   onCancel,
   isPending,
}: ConfirmDialogProps) {
   return (
      <Dialog open={open} onOpenChange={open => !open && onCancel()}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button variant="outline" onClick={onCancel} disabled={isPending}>
                  {cancelLabel}
               </Button>
               <Button variant={variant} onClick={onConfirm} disabled={isPending}>
                  {isPending ? "Processing..." : confirmLabel}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
