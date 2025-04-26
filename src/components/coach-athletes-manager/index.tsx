import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Typography, Box } from '@mui/material'
import AthletesTable from '../settings/coach/athletes-table'
import SearchAthlete from '../settings/coach/search-athlete'
import { fetchCoachByUserId } from '../../services/coach'
import LoadingSpinner from '../loading/loading-spinner'

interface CoachAthletesManagerProps {
  userId: string
}

const CoachAthletesManager: React.FC<CoachAthletesManagerProps> = ({ userId }) => {
  const {
    data: coachData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['coachData', userId],
    queryFn: () => fetchCoachByUserId(userId),
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        Nepodarilo sa načítať údaje trénera. Skúste to znova neskôr.
      </Typography>
    )
  }

  if (!coachData) {
    return (
      <Typography sx={{ mt: 3 }}>
        Nepodarilo sa načítať údaje trénera. Skúste to znova neskôr.
      </Typography>
    )
  }

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
          <AthletesTable coachId={coachData.docs[0].id} />
        </div>
      </Box>
    </Box>
  )
}

export default CoachAthletesManager
