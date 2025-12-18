import * as React from 'react'
import { cn } from '@/lib/utils'

const TabsContext = React.createContext(null)

const Tabs = ({ children, className, value, defaultValue, onValueChange }) => {
  const [internal, setInternal] = React.useState(defaultValue || 'all')
  const selected = value !== undefined ? value : internal

  const handleChange = (newVal) => {
    if (value === undefined) setInternal(newVal)
    onValueChange && onValueChange(newVal)
  }

  return (
    <TabsContext.Provider value={{ selected, onChange: handleChange }}>
      <div className={cn('tabs', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ children, className }) => <div className={cn('flex space-x-2', className)}>{children}</div>

const TabsTrigger = ({ children, className, value, ...props }) => {
  const ctx = React.useContext(TabsContext)
  const isActive = ctx?.selected === value
  return (
    <button
      aria-pressed={isActive}
      onClick={() => ctx && ctx.onChange && ctx.onChange(value)}
      className={cn('px-3 py-1 rounded-md text-sm', isActive ? 'bg-primary text-white' : '', className)}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, className, value }) => {
  const ctx = React.useContext(TabsContext)
  // If value not provided, always render
  if (value && ctx && ctx.selected !== value) return null
  return <div className={cn('p-4', className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
