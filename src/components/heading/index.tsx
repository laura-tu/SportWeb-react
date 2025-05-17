import React from 'react'
import Typography from '@mui/material/Typography'

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children?: React.ReactNode
  className?: string
  text: string
}

const Heading: React.FC<HeadingProps> = ({ level = 1, children, className = '', text }) => {
  const variantMap: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  }

  return (
    <Typography
      variant={variantMap[level]}
      className={className}
      color="text.primary"
      sx={{ fontWeight: 'semibold' }}
    >
      {children ? children : text}
    </Typography>
  )
}

export default Heading
