"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
   value?: string
   onChange: (value: string | undefined) => void
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 2 * 1024 * 1024

export function ImageUpload({ value, onChange }: ImageUploadProps) {
   const [error, setError] = useState<string | null>(null)
   const [isDragging, setIsDragging] = useState(false)
   const inputRef = useRef<HTMLInputElement>(null)

   const handleFile = (file: File) => {
      setError(null)

      if (!ACCEPTED_TYPES.includes(file.type)) {
         setError("Only JPG, PNG, and WebP are accepted")
         return
      }

      if (file.size > MAX_SIZE) {
         setError("File must be under 2MB")
         return
      }

      const reader = new FileReader()
      reader.onload = () => {
         onChange(reader.result as string)
      }
      reader.readAsDataURL(file)
   }

   return (
      <div className="space-y-2">
         {value ? (
            <div className="relative inline-block">
               <img src={value} alt="Preview" className="size-20 rounded-lg object-cover border" />
               <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 size-5"
                  onClick={() => onChange(undefined)}
               >
                  <X className="size-3" />
               </Button>
            </div>
         ) : (
            <div
               className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                     ? "border-primary bg-primary/5"
                     : "border-muted-foreground/25 hover:border-primary/50"
               }`}
               onDragOver={e => {
                  e.preventDefault()
                  setIsDragging(true)
               }}
               onDragLeave={() => setIsDragging(false)}
               onDrop={e => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files[0]
                  if (file) handleFile(file)
               }}
               onClick={() => inputRef.current?.click()}
            >
               <Upload className="size-6 mx-auto mb-1 text-muted-foreground" />
               <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>
            </div>
         )}
         {error && <p className="text-xs text-destructive">{error}</p>}
         <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => {
               const file = e.target.files?.[0]
               if (file) handleFile(file)
            }}
         />
      </div>
   )
}
