import React, { useEffect, useState } from 'react'
import { InputLabel, FormControl, Select, MenuItem } from '@mui/material'
import { fetchSports } from '../../../services/sports.ts'

interface SportFieldProps {
  value: string[]
  onChange: (value: string[]) => void
}

const SportField: React.FC<SportFieldProps> = ({ value, onChange }) => {
  const [sports, setSports] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSports = async () => {
      try {
        const sportsData = await fetchSports()
        setSports(sportsData)
      } catch (error) {
        console.error('Error fetching sports:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSports()
  }, [])

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Šport</InputLabel>
      <Select
        label="Šport"
        multiple
        value={value}
        onChange={e => onChange(e.target.value as string[])}
        disabled={loading}
      >
        {loading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          sports.map(sport => (
            <MenuItem key={sport.id} value={sport.id}>
              {sport.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  )
}

export default SportField
