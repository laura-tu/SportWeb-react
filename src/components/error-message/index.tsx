import React from 'react'
import { Typography } from '@mui/material'

export const ErrorMessage = ({ message }) => (
  <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 4, color: 'red' }}>
    {message}
  </Typography>
)
