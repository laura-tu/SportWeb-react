import React, { useEffect, useState } from 'react'
import { FormControl, Select, InputLabel, MenuItem } from '@mui/material'
import { fetchSportClubs } from '../../../services/sport-clubs'
import { Club } from '../../../utils/interfaces'

interface ClubFieldProps {
  value: string
  onChange: (value: string) => void
}

const ClubField: React.FC<ClubFieldProps> = ({ value, onChange }) => {
  const [clubOptions, setClubOptions] = useState<Club[]>([])

  useEffect(() => {
    const loadClubs = async () => {
      const clubs = await fetchSportClubs()
      setClubOptions(clubs)
    }

    loadClubs()
  }, [])

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Športový klub</InputLabel>
      <Select label="Športový klub" value={value} onChange={e => onChange(e.target.value)}>
        {clubOptions.map(club => (
          <MenuItem key={club.id} value={club.id}>
            {club.name}
          </MenuItem>
        ))}
        {!clubOptions.length && <MenuItem disabled>N/A</MenuItem>}
      </Select>
    </FormControl>
  )
}

export default ClubField
