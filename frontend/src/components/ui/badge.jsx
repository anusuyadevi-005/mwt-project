import * as React from 'react'
import { cn } from '@/lib/utils'

const Badge = ({ className, children, ...props }) => (
  <span className={cn('inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium', className)} {...props}>
    {children}
  </span>
)

export { Badge }
