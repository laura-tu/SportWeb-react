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
        flexDirection: 'row',
        justifyItems: 'space-evenly',
        gap: 2,
        py: 2,
        width: { xs: '90%', sm: '93%', md: 700, lg: 820 },
        px: 4,
        mx: 3,
        alignItems: 'center',
        /*bgcolor: theme => (theme.palette.mode === 'dark' ? 'white' : '#0492c2'),*/
        color: theme => (theme.palette.mode === 'dark' ? 'white' : 'black'),
        borderRadius: 3,
        border: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{ textAlign: { xs: 'left' }, display: 'flex', flex: 1 }}
        className="text-sky-500"
      >
        Zobraziť:
      </Typography>
      <Box className="flex gap-4 md:gap-10 flex-col xs:flex-row">
        <Button
          variant="contained"
          onClick={() => setCurrentForm('athlete')}
          sx={{ width: 'auto', backgroundColor: '#BAE0F3', color: 'black' }}
        >
          profil športovca
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setCurrentForm('coach')}
          sx={{ width: 'auto' }}
        >
          profil trénera
        </Button>
      </Box>
    </Box>
  )
}
