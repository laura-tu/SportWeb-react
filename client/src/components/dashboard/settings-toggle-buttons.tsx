import React from 'react'
import { Button, Box } from '@mui/material'
import Typography from '@mui/material/Typography'

export const SettingsToggleButtons = ({ session, setCurrentForm }) => {
  if (!session?.user?.roles?.includes('user') || !session?.user?.roles?.includes('sportCoach')) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on small screens, row on larger screens
        justifyContent: 'center',
        gap: 2,
        p: 2,
        width: { xs: '70%', sm: '65%', md: 600 },
        margin: '0 auto',
        alignItems: 'center',
        bgcolor: theme => (theme.palette.mode === 'dark' ? 'white' : '#0492c2'),
        color: theme => (theme.palette.mode === 'dark' ? 'black' : 'white'),
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        Zobraziť:
      </Typography>
      <Button
        variant="contained"
        onClick={() => setCurrentForm('athlete')}
        sx={{ width: { xs: '50%', sm: 'auto' }, backgroundColor: '#BAE0F3', color: 'black' }}
      >
        profil športovca
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setCurrentForm('coach')}
        sx={{ width: { xs: '50%', sm: 'auto' } }}
      >
        profil trénera
      </Button>
    </Box>
  )
}
