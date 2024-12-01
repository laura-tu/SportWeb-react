import React from 'react'
import { TextField } from '@mui/material'

interface CoachFieldProps {
  coach: { name: string | null } | null
}

const CoachField: React.FC<CoachFieldProps> = ({ coach }) => {
  // If coach is null or coach.name is null, use a fallback value
  const coachName = coach?.name || '-'

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
