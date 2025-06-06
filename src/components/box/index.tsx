import React from 'react'
import { cn } from '@/utils/cn'

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
  direction?: 'row' | 'col'
}

const Box: React.FC<BoxProps> = ({ className, children, direction = 'row', ...props }) => {
  return (
    <div
      className={cn('flex', direction === 'col' ? 'flex-col' : 'flex-row', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Box
