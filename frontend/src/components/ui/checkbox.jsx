import * as React from 'react'
import { cn } from '@/lib/utils'

const Checkbox = ({ id, checked, onCheckedChange, className, ...props }) => (
  <input id={id} type="checkbox" checked={checked} onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)} className={cn('h-4 w-4', className)} {...props} />
)

export { Checkbox }
