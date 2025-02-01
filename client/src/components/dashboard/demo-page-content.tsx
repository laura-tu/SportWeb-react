import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function DemoPageContent() {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for DemoPage</Typography>
    </Box>
  )
}
