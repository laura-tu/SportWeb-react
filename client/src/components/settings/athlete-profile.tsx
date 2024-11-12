import React from 'react'
import { Box, Typography, TextField } from '@mui/material'
import { fetchAthleteByUserId, AthleteIdResponse } from '../../services/athlete.ts'
import { useQuery } from '@tanstack/react-query'
import LoadingOverlay from '../loading/loading-overlay.tsx'

export interface SettingsProps {
  userId: string
}

const SettingsAthlete: React.FC<SettingsProps> = ({ userId }) => {
  const {
    data: athleteData,
    isLoading: isFetchingAthleteId,
    error: athleteIdError,
  } = useQuery<AthleteIdResponse>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
  })

  const athlete = athleteData?.docs[0]

  if (isFetchingAthleteId) {
    return <LoadingOverlay />
  }

  if (athleteIdError)
    return <p>Error loading athlete information by user ID: {athleteIdError.message}</p>

  if (!athlete) return <p>Athlete not found for this user.</p>

  return (
    <Box
      sx={{
        py: 4,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      {athlete && (
        <Box sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
          <Typography variant="h6">Informácie o športovcovi:</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Dátum narodenia"
              variant="outlined"
              fullWidth
              margin="normal"
              value={new Date(athlete.birth_date).toLocaleDateString()}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Pohlavie"
              variant="outlined"
              fullWidth
              margin="normal"
              value={athlete.gender === 'zena' ? 'Žena' : 'Muž'}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Šport:"
              variant="outlined"
              fullWidth
              margin="normal"
              value={athlete.sport.map(sport => sport.name).join(', ')}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
            <TextField
              label="Športový klub:"
              variant="outlined"
              fullWidth
              margin="normal"
              value={
                typeof athlete.sport_club === 'string'
                  ? athlete.sport_club
                  : athlete.sport_club?.name || ''
              }
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SettingsAthlete
