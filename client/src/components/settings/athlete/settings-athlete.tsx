import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { fetchSports } from '../../../services/sports.ts'
import { fetchSportClubs } from '../../../services/sport-clubs.ts'
import useFetchAthlete from '../hooks/useFetchAthlete.ts'
import useFetchCoach from '../hooks/useFetchCoach.ts'
import BirthDateField from '../fields/birthdate-field.tsx'
import GenderField from '../fields/gender-field.tsx'
import SuccessModal from '../../success-modal/index.tsx'
import ErrorModal from '../../error-modal/index.tsx'
import { formatDateForInput } from '../../../utils/formatDate.ts'
import { updateAthleteData } from '../../../services/athlete.ts'
import { Sport, Club } from '../../../utils/interfaces.ts'

interface AthleteFormData {
  birth_date: string
  gender: string
  sport: string[] // sport should be an array of strings
  sport_club: string
  coach: string
}
const SettingsAthlete = ({ userId }) => {
  const queryClient = useQueryClient()
  const originalDataRef = useRef<any>(null)

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [sports, setSports] = useState<Sport[]>([])
  const [clubs, setClubs] = useState<Club[]>([])

  const [formData, setFormData] = useState<AthleteFormData>({
    birth_date: '',
    gender: '',
    sport: [],
    sport_club: '',
    coach: '',
  })

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { coach, isFetchingCoach } = useFetchCoach(athlete?.id)

  useEffect(() => {
    const loadOptions = async () => {
      const [fetchedSports, fetchedClubs] = await Promise.all([fetchSports(), fetchSportClubs()])
      setSports(fetchedSports) // Populate sports state
      setClubs(fetchedClubs) // Populate clubs state

      if (athlete) {
        const initialData = {
          birth_date: athlete.birth_date ? formatDateForInput(athlete.birth_date) : '', // Format to `YYYY-MM-DD`
          gender: athlete.gender || '',
          sport: athlete.sport.map(s => s.id) || [],
          sport_club:
            typeof athlete.sport_club === 'string'
              ? athlete.sport_club
              : athlete.sport_club?.id || '',
          coach: coach?.name || '',
        }

        setFormData(initialData)
        originalDataRef.current = initialData
      }
    }

    loadOptions()
  }, [athlete, coach])

  const mutation = useMutation({
    mutationKey: ['update_athlete_data'],
    mutationFn: ({
      athleteId,
      updateData,
    }: {
      athleteId: string
      updateData: Record<string, any>
    }) => updateAthleteData(athleteId, updateData),
    onSuccess: () => {
      setSuccessModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['athleteId', userId] }) // Refresh athlete data
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const getModifiedData = () => {
    const modifiedData = {}
    for (const key in formData) {
      if (formData[key] !== originalDataRef.current[key]) {
        modifiedData[key] = formData[key]
      }
    }
    return modifiedData
  }

  const handleSaveChanges = () => {
    if (!athlete) return

    const modifiedData = getModifiedData()

    if (Object.keys(modifiedData).length > 0) {
      mutation.mutate({
        athleteId: athlete.id,
        updateData: modifiedData,
      })
    }
  }

  if (isFetchingAthleteId) return <p>Loading...</p>
  if (athleteError) return <p>Error: {athleteError.message}</p>

  return (
    <Box>
      <Box
        sx={{
          py: 3,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: { xs: '75%', sm: '65%', md: 600 },
          margin: '0 auto',
          border: 1,
          borderRadius: 3,
          mt: 2,
        }}
      >
        <Box sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
          <Typography variant="h6">Informácie o športovcovi:</Typography>

          <Box sx={{ mt: 2 }}>
            <BirthDateField
              value={formData.birth_date}
              onChange={value => handleInputChange('birth_date', value)}
            />

            <GenderField value={formData.gender} />

            <FormControl fullWidth margin="normal">
              <InputLabel>Šport</InputLabel>
              <Select
                label="Šport"
                multiple
                value={formData.sport}
                onChange={e => handleInputChange('sport', e.target.value)}
              >
                {sports.map(sport => (
                  <MenuItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Športový klub</InputLabel>
              <Select
                label="Športový klub"
                value={formData.sport_club}
                onChange={e => handleInputChange('sport_club', e.target.value)}
              >
                {clubs.map(club => (
                  <MenuItem key={club.id} value={club.id}>
                    {club.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Coach */}
            <TextField
              label="Tréner"
              variant="outlined"
              fullWidth
              margin="normal"
              value={isFetchingCoach ? 'Načítavam...' : formData.coach || '-'}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleSaveChanges}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Ukladám...' : 'Uložiť zmeny'}
        </Button>

        <SuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          text="Údaje boli úspešne aktualizované!"
        />

        <ErrorModal
          open={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          text="aktualizácií údajov"
        />
      </Box>
    </Box>
  )
}

export default SettingsAthlete
