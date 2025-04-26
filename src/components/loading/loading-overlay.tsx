import React from 'react'
import { Box, CircularProgress } from '@mui/material'

interface LoadingOverlayProps {
  height?: string | number
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ height = '100vh' }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height}
      width="100%"
      position="fixed"
      top={0}
      left={0}
      bgcolor="rgba(255, 255, 255, 0.8)"
      zIndex={9999}
    >
      <CircularProgress />
    </Box>
  )
}

export default LoadingOverlay
