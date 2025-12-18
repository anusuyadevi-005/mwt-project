import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props}>
      {children}
    </div>
  )
})
Card.displayName = 'Card'

const CardHeader = ({ className, ...props }) => (
  <div className={cn('p-4', className)} {...props} />
)
CardHeader.displayName = 'CardHeader'

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-md font-semibold', className)} {...props} />
)
CardTitle.displayName = 'CardTitle'

const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)
CardDescription.displayName = 'CardDescription'

const CardContent = ({ className, ...props }) => (
  <div className={cn('p-4', className)} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = ({ className, ...props }) => (
  <div className={cn('p-4 pt-0', className)} {...props} />
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
