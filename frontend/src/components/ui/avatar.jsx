import * as React from 'react'
import { cn } from '@/lib/utils'

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props}>
      {children}
    </div>
  )
})
Avatar.displayName = 'Avatar'

const AvatarImage = ({ src, alt, className, ...props }) => (
  <img src={src} alt={alt} className={cn('h-full w-full object-cover', className)} {...props} />
)
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = ({ children, className, ...props }) => (
  <div className={cn('flex h-full w-full items-center justify-center bg-muted text-sm font-medium', className)} {...props}>
    {children}
  </div>
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
