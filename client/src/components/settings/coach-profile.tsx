import React from 'react'
import { Box, Typography, TextField } from '@mui/material'
import { fetchCoachByUserId, CoachIdResponse } from '../../services/coach.ts'
import { useQuery } from '@tanstack/react-query'
import { SettingsProps } from './athlete-profile.tsx'
import LoadingOverlay from '../loading/loading-overlay.tsx'

const SettingsCoach: React.FC<SettingsProps> = ({ userId }) => {
  const {
    data: coachData,
    isLoading: isFetchingCoachId,
    error: coachIdError,
  } = useQuery<CoachIdResponse>({
    queryKey: ['coachId', userId],
    queryFn: () => fetchCoachByUserId(userId),
  })

  const coach = coachData?.docs[0]

  if (isFetchingCoachId) {
    return <LoadingOverlay />
  }

  if (coachIdError) return <p>Error loading coach information by user ID: {coachIdError.message}</p>

  if (!coach) return <p>Coach not found for this user.</p>

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
      {coach && (
        <Box sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
          <Typography variant="h6">Informácie o trénerovi:</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Šport:"
              variant="outlined"
              fullWidth
              margin="normal"
              value={coach.sport.map(sport => sport.name).join(', ')}
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
                typeof coach.sport_club === 'string'
                  ? coach.sport_club
                  : coach.sport_club?.name || ''
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

export default SettingsCoach
