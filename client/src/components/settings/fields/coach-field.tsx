import React from 'react'
import { TextField } from '@mui/material'
import useFetchCoach from '../hooks/useFetchCoach.ts'

interface CoachFieldProps {
  athleteId: string
}

const CoachField: React.FC<CoachFieldProps> = ({ athleteId }) => {
  const { coach, isFetchingCoach, coachError } = useFetchCoach(athleteId)

  const coachName = isFetchingCoach
    ? 'Načítavam...'
    : coachError
      ? 'Chyba pri načítaní trénera'
      : coach?.name || '-'

  return (
    <TextField
      label="Tréner"
      variant="outlined"
      fullWidth
      margin="normal"
      value={coachName}
      InputProps={{
        readOnly: true,
      }}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      }}
    />
  )
}

export default CoachField
