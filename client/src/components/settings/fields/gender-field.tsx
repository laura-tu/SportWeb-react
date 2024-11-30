import React from 'react'
import { TextField } from '@mui/material'

interface GenderFieldProps {
  value: string
}

const GenderField: React.FC<GenderFieldProps> = ({ value }) => (
  <TextField
    label="Pohlavie"
    variant="outlined"
    fullWidth
    margin="normal"
    value={value}
    slotProps={{
      input: {
        readOnly: true,
      },
    }}
    sx={{
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    }}
  />
)

export default GenderField
