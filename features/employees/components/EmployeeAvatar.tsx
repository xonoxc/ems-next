import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EmployeeAvatarProps {
   src?: string | null
   firstName: string
   lastName: string
   className?: string
}

export function EmployeeAvatar({ src, firstName, lastName, className }: EmployeeAvatarProps) {
   const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()

   return (
      <Avatar className={className}>
         <AvatarImage src={src ?? undefined} />
         <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
   )
}
