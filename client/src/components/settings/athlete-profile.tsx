import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import {
  fetchAthleteByUserId,
  AthleteIdResponse,
  updateAthleteData,
} from '../../services/athlete.ts'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import LoadingOverlay from '../loading/loading-overlay.tsx'
import SuccessModal from '../success-modal/index.tsx'
import ErrorModal from '../error-modal/index.tsx'

export interface SettingsProps {
  userId: string
}

const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString) // Convert to a date object
  if (isNaN(date.getTime())) {
    // If the conversion fails, return the original string
    return ''
  }
  return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

const SettingsAthlete: React.FC<SettingsProps> = ({ userId }) => {
  const queryClient = useQueryClient()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const {
    data: athleteData,
    isLoading: isFetchingAthleteId,
    error: athleteIdError,
  } = useQuery<AthleteIdResponse>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
  })

  const athlete = athleteData?.docs[0]
  const originalDataRef = useRef<any>(null) // To hold the initial data for comparison

  const [formData, setFormData] = useState({
    birth_date: '',
    gender: '',
    sport: '',
    sport_club: '',
  })

  useEffect(() => {
    if (athlete) {
      const initialData = {
        birth_date: athlete.birth_date ? formatDateForInput(athlete.birth_date) : '', // Format `birth_date` to `YYYY-MM-DD` or leave empty
        gender: athlete.gender || '',
        sport: athlete.sport.map(sport => sport.name).join(', ') || '',
        sport_club:
          typeof athlete.sport_club === 'string'
            ? athlete.sport_club
            : athlete.sport_club?.name || '',
      }
      setFormData(initialData)
      originalDataRef.current = initialData // Save the original data for comparison
    }
  }, [athlete])

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

  const getModifiedData = () => {
    const modifiedData: Record<string, any> = {}
    for (const key in formData) {
      if (formData[key] !== originalDataRef.current[key]) {
        modifiedData[key] = formData[key]
      }
    }
    return modifiedData
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'birth_date') {
      const isValidDate = !isNaN(new Date(value).getTime())
  
      if (isValidDate) {
        setFormData(prevState => ({
          ...prevState,
          [field]: new Date(value).toISOString().split('T')[0], // Format as YYYY-MM-DD
        }))
      } else {
        console.error('Invalid date value:', value) // Debug invalid date
        //alert('Invalid date format. Please use YYYY-MM-DD.')
      }
    } else {
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

  if (isFetchingAthleteId) {
    return <LoadingOverlay />
  }

  if (athleteIdError) {
    return <p>Chyba pri načítaní informácií o športovcovi podľa ID používateľa: {athleteIdError.message}</p>
  }

  if (!athlete) {
    return <p>Nenašli sa údaje o športovcovi</p>
  }

  return (
    <Box>
      <Box
        sx={{
          py: 4,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: { xs: '75%', sm: '65%', md: 600 },
          margin: '0 auto',
          border: 1,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
          <Typography variant="h6">Informácie o športovcovi:</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Dátum narodenia"
              variant="outlined"
              fullWidth
              margin="normal"
              type="date"
              value={formData.birth_date}
              onChange={e => handleInputChange('birth_date', e.target.value)}
              
            />

            <TextField
              label="Pohlavie"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.gender}
              onChange={e => handleInputChange('gender', e.target.value)}
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />

            <TextField
              label="Šport"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.sport}
              onChange={e => handleInputChange('sport', e.target.value)}
            />
            <TextField
              label="Športový klub"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.sport_club}
              onChange={e => handleInputChange('sport_club', e.target.value)}
            />
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="success"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          margin: '0 auto',
          mt: 3,
        }}
        onClick={handleSaveChanges}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Ukladám...' : 'Uložiť zmeny'}
      </Button>

      {/* Success Modal */}
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
  )
}

export default SettingsAthlete
