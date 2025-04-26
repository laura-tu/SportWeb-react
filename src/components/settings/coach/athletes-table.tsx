import React from 'react'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getCoachData } from '../../../services/coach'
import LoadingSpinner from '@/components/loading/loading-spinner'
import Box from '@/components/box'

export interface CoachProps {
  coachId: string
}

const AthletesTable: React.FC<CoachProps> = ({ coachId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coach', coachId],
    queryFn: () => getCoachData(coachId),
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Box direction="col" className="text-center mt-4">
        <Typography variant="body1" color="error">
          Nepodarilo sa načítať dáta trénera.
        </Typography>
      </Box>
    )
  }

  const coach = data

  if (!coach) {
    return (
      <Box direction="col" className="text-center mt-4">
        <Typography variant="body1" color="text.secondary">
          Nepodarilo sa nájsť trénera s týmto ID.
        </Typography>
      </Box>
    )
  }
  const athletes = coach.athletes || []

  return (
    <Box>
      <Typography variant="body1" gutterBottom>
        Toto je zoznam športovcov vedených trénerom {coach.name}.
      </Typography>
      {athletes.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow className="bg-cyan-200/80 ">
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Športovec</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Pohlavie</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Dátum narodenia
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', borderLeft: 1 }}>
                  ID
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {athletes.map(ath => {
                if (typeof ath === 'string') {
                  return (
                    <TableRow key={ath}>
                      <TableCell colSpan={3} align="center">
                        Športovec ID: {ath}
                      </TableCell>
                    </TableRow>
                  )
                }

                return (
                  <TableRow key={ath.id}>
                    <TableCell sx={{ textAlign: 'center' }}>{ath.name || 'Neznámy'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {ath.gender === 'muz' ? 'muž' : 'žena'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {new Date(ath.birth_date).toLocaleDateString('sk-SK')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', borderLeft: 1 }}>
                      {ath.id || 'Neznáme'}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" mt={2}>
          Tento tréner nemá zatiaľ pridelených športovcov.
        </Typography>
      )}
    </Box>
  )
}

export default AthletesTable
