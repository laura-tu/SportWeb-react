import React from 'react'
import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import LoadingOverlay from '../loading/loading-overlay.tsx'
import { getCoachData } from '../../services/coach.ts'

export interface CoachProps {
  coachId: string
}

const AthleteList: React.FC<CoachProps> = ({ coachId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coach', coachId],
    queryFn: () => getCoachData(coachId),
  })

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <LoadingOverlay />
        <Typography variant="body1" mt={2}>
          Načítavam dáta trénera...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="error">
          Nepodarilo sa načítať dáta trénera.
        </Typography>
      </Box>
    )
  }

  // Extract the first coach from docs
  const coach = data

  if (!coach) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Nepodarilo sa nájsť trénera s týmto ID.
        </Typography>
      </Box>
    )
  }

  const { athlete } = coach
  return (
    <Box>
      <Box sx={{ textAlign: 'left', width: '100%' }}>
        <Typography variant="h5" className="py-3 font-bolder">
          Športovci
        </Typography>
        <Typography variant="body1" className="pb-5">
          Toto je zoznam športovcov vedených trénerom. Ak by ste chceli pridať športovca,
          kontaktujte testera (admina).
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)', // 2 boxes per row on extra small (mobile)
              sm: 'repeat(3, 1fr)', // 3 boxes per row on small (tablet)
              md: 'repeat(4, 1fr)', // 4 boxes per row on medium (laptop)
            },
            gap: 2,
          }}
        >
          {athlete.length > 0 ? (
            athlete.map(ath => {
              if (typeof ath === 'string') {
                return (
                  <Box
                    key={ath}
                    sx={{
                      p: 2,
                      border: 1,
                      borderRadius: '8px',
                      textAlign: 'center',
                      transition: 'box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: 4,
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Typography variant="body1">Športovec ID: {ath}</Typography>
                  </Box>
                )
              }

              return (
                <Box
                  key={ath.id}
                  sx={{
                    p: 2,
                    border: 1,
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: 4,
                      cursor: 'pointer',
                    },
                  }}
                >
                  <Typography variant="h5">{ath.name}</Typography>
                  <Typography variant="body2">{ath.gender === 'muz' ? 'muž' : 'žena'}</Typography>
                  <Typography variant="body2">
                    {new Date(ath.birth_date).toLocaleDateString('sk-SK')}
                  </Typography>
                </Box>
              )
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              Tento tréner nemá zatiaľ pridelených športovcov.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AthleteList
