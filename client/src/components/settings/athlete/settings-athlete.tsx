import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, TextField } from '@mui/material'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import useFetchAthlete from '../hooks/useFetchAthlete.ts'
import useFetchCoach from '../hooks/useFetchCoach.ts'
import BirthDateField from '../fields/birthdate-field.tsx'
import GenderField from '../fields/gender-field.tsx'
import SportField from '../fields/sport-field.tsx'
import ClubField from '../fields/club-field.tsx'
import CoachField from '../fields/coach-field.tsx'
import SuccessModal from '../../success-modal/index.tsx'
import ErrorModal from '../../error-modal/index.tsx'
import { formatDateForInput } from '../../../utils/formatDate.ts'
import { updateAthleteData } from '../../../services/athlete.ts'

interface AthleteFormData {
  birth_date: string
  gender: string
  sport: string[]
  club: string
  coach: string
}

const SettingsAthlete = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const originalDataRef = useRef<AthleteFormData | null>(null)

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const [formData, setFormData] = useState<AthleteFormData>({
    birth_date: '',
    gender: '',
    sport: [],
    club: '',
    coach: '',
  })

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { coach, isFetchingCoach } = useFetchCoach(athlete?.id)

  // Load athlete and coach data into formData
  useEffect(() => {
    if (athlete) {
      const initialData = {
        birth_date: athlete.birth_date ? formatDateForInput(athlete.birth_date) : '',
        gender: athlete.gender || '',
        sport: athlete.sport.map(s => s.id) || [],
        club: typeof athlete.club === 'string' ? athlete.club : athlete.club?.id || '',
        coach: coach?.name || '',
      }

      setFormData(initialData)
      originalDataRef.current = initialData
    }
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
      queryClient.invalidateQueries({ queryKey: ['athleteId', userId] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const getModifiedData = () => {
    const modifiedData: Record<string, any> = {}
    for (const key in formData) {
      if (formData[key] !== originalDataRef.current[key]) {
        modifiedData[key] = formData[key]
      }
    }
    return modifiedData
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    if (field === 'birth_date') {
      const isValidDate = !isNaN(new Date(value as string).getTime())

      if (isValidDate) {
        setFormData(prevState => ({
          ...prevState,
          [field]: new Date(value as string).toISOString().split('T')[0], // Format as YYYY-MM-DD
        }))
      } else {
        console.error('Invalid date value:', value)
      }
    } else {
      // Handle the case for 'sport' where value is an array of strings
      setFormData(prevState => ({
        ...prevState,
        [field]: value,
      }))
    }
  }

  const handleSaveChanges = () => {
    if (!athlete) {
      //alert('No athlete data available to update.')
      return
    }

    const modifiedData = getModifiedData()

    if (Object.keys(modifiedData).length === 0) {
      console.error('No changes to save.')
      return
    }

    mutation.mutate({
      athleteId: athlete.id,
      updateData: modifiedData, // Send only modified fields
    })
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

            <SportField
              value={formData.sport}
              onChange={value => handleInputChange('sport', value)}
            />

            <ClubField value={formData.club} onChange={value => handleInputChange('club', value)} />

            {athlete?.id && <CoachField athleteId={athlete.id} />}
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
