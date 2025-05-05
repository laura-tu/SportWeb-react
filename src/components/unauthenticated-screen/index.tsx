import React from 'react'
import { Typography } from '@mui/material'
import LoginForm from '../login-form'

export const UnauthenticatedScreen = () => (
  <div>
    <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 4 }}>
      Nie ste prihlásený
    </Typography>
    <LoginForm onClose={() => console.log('Zatvor prihlasovací formulár')} />
  </div>
)
