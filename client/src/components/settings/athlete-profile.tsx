import React from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { fetchAthleteByUserId, AthleteIdResponse } from '../../services/athlete.ts'
import { useQuery } from '@tanstack/react-query'

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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
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
      <Typography variant="h4" gutterBottom>
        Profil
      </Typography>
      <Typography variant="body1">Aktualizuj svoje informácie tu.</Typography>

      {athlete && (
        <Box sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
          <Typography variant="h6">Informácie o športovcovi:</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography>
              <strong>Dátum narodenia:</strong> {new Date(athlete.birth_date).toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>Pohlavie:</strong> {athlete.gender === 'zena' ? 'Žena' : 'Muž'}
            </Typography>
            <Typography>
              <strong>Šport(y):</strong> {athlete.sport.map(sport => sport.name).join(', ')}
            </Typography>
            <Typography>
              <strong>Športové kluby:</strong>{' '}
              {typeof athlete.sport_club === 'string'
                ? athlete.sport_club
                : athlete.sport_club?.name}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SettingsAthlete
