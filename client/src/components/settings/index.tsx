import React from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { fetchAthlete, fetchAthleteByUserId, AthleteIdResponse } from '../../services/athlete.ts'
import { useQuery } from '@tanstack/react-query'
import { Athlete } from '../../utils/interfaces.ts'

interface SettingsProps {
  userId: string
}

export default function Settings({ userId }: SettingsProps) {
  // Step 1: Get the athlete ID by user ID
  const {
    data: athleteData,
    isLoading: isFetchingAthleteId,
    error: athleteIdError,
  } = useQuery<AthleteIdResponse>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
  })

  // Select the first athlete document from docs
  const firstAthleteDoc = athleteData?.docs[0]
  const athleteId = firstAthleteDoc?.id

  // Step 2: Fetch the athlete data by athlete ID
  const {
    data: athlete,
    isLoading: isFetchingAthlete,
    error: athleteError,
  } = useQuery<Athlete>({
    queryKey: ['athlete', athleteId],
    queryFn: () => fetchAthlete(athleteId!),
    enabled: !!athleteId, // Only run this query if athleteId exists
  })

  // Display loading and error states
  if (isFetchingAthleteId || isFetchingAthlete) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (athleteIdError)
    return <p>Error loading athlete information by user ID: {athleteIdError.message}</p>
  if (athleteError) return <p>Error loading athlete data: {athleteError.message}</p>

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
      <Typography variant="body1" paragraph>
        Aktualizuj svoje informácie tu.
      </Typography>

      {/* Display athlete's data */}
      {athlete && (
        <Box sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
          <Typography variant="h6">Informácie o športovcovi:</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography>
              <strong>Dátum narodenia:</strong> {new Date(athlete.birth_date).toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>Pohlavie:</strong> {athlete.gender === 'zena' ? 'Female' : 'Male'}
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
