import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import useFetchAthlete from '../hooks/useFetchAthlete'
import useFetchCoach from '../hooks/useFetchCoach'
import BirthDateField from '../components/fields/birthdate-field'
import GenderField from '../components/fields/gender-field'
import SportField from '../components/fields/sport-field'
import ClubField from '../components/fields/club-field'
import CoachField from '../components/fields/coach-field'
import SuccessModal from '../../success-modal/index'
import ErrorModal from '../../error-modal/index'
import { formatDateForInput } from '../../../utils/formatDate'
import { updateAthleteData } from '../../../services/athlete'
import SettingsUser from '../user/index'

interface AthleteFormData {
  birth_date: string
  gender: string
  sport: string[]
  club: string
  coach: string
}

const AthleteProfile = ({ userId }: { userId: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const getModifiedData = () => {
    const modifiedData: Record<string, any> = {}

    // Check if originalDataRef.current is null
    if (!originalDataRef.current) {
      return modifiedData // Return an empty object if no original data
    }

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
        console.error('Nesprávny formát dátumu:', value)
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
      console.error('Žiadne zmeny.')
      return
    }

    mutation.mutate({
      athleteId: athlete.id,
      updateData: modifiedData, // Send only modified fields
    })
  }

  if (isFetchingAthleteId || isFetchingCoach)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    )
  if (athleteError)
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        {athleteError.message}
        Nepodarilo sa načítať údaje trénera. Skúste to znova neskôr.
      </Typography>
    )

  return (
    <div className="box-border w-[60vw]">
      <div className="flex flex-col w-full py-2 px-2 mx-3 md:py-4 md:px-4 md:mx-0 lg:py-8 lg:px-8 lg:mx-3">
        <Box
          className="flex flex-wrap"
          sx={{ width: { xs: '80%', sm: '60%', md: 'auto', lg: 700 } }}
        >
          <SettingsUser userId={userId} />
        </Box>

        <Box className="flex h-[85vh] mt-10">
          <Box sx={{ textAlign: 'left', width: { xs: '75%', sm: '65%', md: 300, lg: 700 } }}>
            <Typography variant="h5">Športovec</Typography>

            <Box sx={{ mt: 2 }}>
              <div className="flex flex-col md:flex-row gap-4">
                <BirthDateField
                  value={formData.birth_date}
                  onChange={value => handleInputChange('birth_date', value)}
                />

                <GenderField value={formData.gender} />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <SportField
                  value={formData.sport}
                  onChange={value => handleInputChange('sport', value)}
                />

                <ClubField
                  value={formData.club}
                  onChange={value => handleInputChange('club', value)}
                />

                {athlete?.id && coach && <CoachField coach={coach} />}
              </div>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleSaveChanges}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Ukladám...' : 'Uložiť zmeny'}
            </Button>
          </Box>

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
      </div>
    </div>
  )
}

export default AthleteProfile
