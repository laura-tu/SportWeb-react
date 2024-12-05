import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Typography, Box, CircularProgress } from '@mui/material'
import AthleteList from '../settings/athlete-list.tsx'
import SearchAthlete from '../settings/coach/search-athlete.tsx'
import { getCoachData, fetchCoachByUserId } from '../../services/coach.ts'

interface CoachAthleteManagerProps {
  userId: string
  roles: ('admin' | 'user' | 'sportCoach')[]
}

const CoachAthleteManager: React.FC<CoachAthleteManagerProps> = ({ userId, roles }) => {
  console.log('userId', userId)
  // Only fetch coach data if the user is a coach
  const {
    data: coachData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coachData', userId],
    queryFn: () => fetchCoachByUserId(userId),
    enabled: roles.includes['sportCoach'],
  })
  console.log('coachData', coachData)

  // Handle loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        Nepodarilo sa načítať údaje trénera. Skúste to znova neskôr.
      </Typography>
    )
  }

  // Render when user is not a coach
  if (!roles.includes('sportCoach')) {
    return <Typography sx={{ mt: 3 }}>Táto funkcia je dostupná iba pre trénerov.</Typography>
  }

  // Ensure coachData is defined before rendering SearchAthlete
  if (!coachData) {
    return (
      <Typography sx={{ mt: 3 }}>
        Nepodarilo sa načítať údaje trénera. Skúste to znova neskôr.
      </Typography>
    )
  }

  // Render SearchAthlete when coach data is available
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
      }}
    >
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom className="pt-4 ">
          Vyhľadať športovca
        </Typography>
        <SearchAthlete coachId={coachData.docs[0].id} />
        <div className="pt-8">
          <AthleteList coachId={coachData.docs[0].id} />
        </div>
      </Box>
    </Box>
  )
}

export default CoachAthleteManager
