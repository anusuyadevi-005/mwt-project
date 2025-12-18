import * as React from 'react'
import { cn } from '@/lib/utils'

const Label = ({ className, children, ...props }) => (
  <label className={cn('mb-2 block text-sm font-medium', className)} {...props}>
    {children}
  </label>
)

export { Label }
