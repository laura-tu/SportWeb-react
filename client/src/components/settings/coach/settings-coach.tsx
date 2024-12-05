import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { fetchCoachByUserId, CoachIdResponse, updateCoachData } from '../../../services/coach.ts'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSports } from '../../../services/sports.ts'
import { fetchSportClubs } from '../../../services/sport-clubs.ts'
import { Sport, Club } from '../../../utils/interfaces.ts'
import LoadingOverlay from '../../loading/loading-overlay.tsx'
import SuccessModal from '../../success-modal/index.tsx'
import ErrorModal from '../../error-modal/index.tsx'
import AthleteList from './athlete-list.tsx'
import SearchAthlete from './search-athlete.tsx'

interface CoachFormData {
  sport: string[]
  sport_club?: string
}

const SettingsCoach: React.FC<{ userId: string }> = ({ userId }) => {
  const queryClient = useQueryClient()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [sportsOptions, setSportsOptions] = useState<Sport[]>([])
  const [clubOptions, setClubOptions] = useState<Club[]>([])
  const [formData, setFormData] = useState<CoachFormData>({
    sport: [],
    sport_club: '',
  })

  const {
    data: coachData,
    isLoading: isFetchingCoachId,
    error: coachIdError,
  } = useQuery<CoachIdResponse>({
    queryKey: ['coachId', userId],
    queryFn: () => fetchCoachByUserId(userId),
  })

  const coach = coachData?.docs[0]

  useEffect(() => {
    if (coach) {
      const initialData = {
        sport: coach.sport.map(s => s.id) || [],
        sport_club:
          typeof coach.sport_club === 'string' ? coach.sport_club : coach.sport_club?.id || '',
      }
      setFormData(initialData)
    }
  }, [coach])

  useEffect(() => {
    const loadOptions = async () => {
      const [sports, clubs] = await Promise.all([fetchSports(), fetchSportClubs()])
      setSportsOptions(sports)
      setClubOptions(clubs)
    }
    loadOptions()
  }, [])

  const mutation = useMutation({
    mutationKey: ['update_coach_data'],
    mutationFn: ({ coachId, updateData }: { coachId: string; updateData: Record<string, any> }) =>
      updateCoachData(coachId, updateData),
    onSuccess: () => {
      setSuccessModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['coachId', userId] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: Array.isArray(value) ? value : [value],
    }))
  }

  const handleSaveChanges = () => {
    if (!coach) {
      console.error('No coach data available to update.')
      return
    }

    const modifiedData = {
      sport: formData.sport,
      sport_club: formData.sport_club,
    }

    mutation.mutate({
      coachId: coach.id,
      updateData: modifiedData, // Send only modified fields
    })
  }

  if (isFetchingCoachId) {
    return <LoadingOverlay />
  }

  if (coachIdError) {
    return <p>Error loading coach information by user ID: {coachIdError.message}</p>
  }

  if (!coach) {
    return <p>Coach not found for this user.</p>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box
          sx={{
            py: 4,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '75%', sm: '65%', md: 600 },
            /*margin: '0 auto',*/
            marginLeft: 3,
            border: 1,
            borderRadius: 3,
            mt: 2,
          }}
        >
          <Typography variant="h6" sx={{ textAlign: 'left', width: '100%', mt: 3 }}>
            Informácie o trénerovi:
          </Typography>

          <Box sx={{ mt: 2, width: '100%' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Šport</InputLabel>
              <Select
                label="Šport"
                multiple
                value={formData.sport}
                onChange={e => handleInputChange('sport', e.target.value)}
              >
                {sportsOptions.map(sport => (
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
                {clubOptions.map(club => (
                  <MenuItem key={club.id} value={club.id}>
                    {club.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          </Box>

          <SuccessModal
            open={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            text="Údaje boli úspešne aktualizované!"
          />

          <ErrorModal
            open={errorModalOpen}
            onClose={() => setErrorModalOpen(false)}
            text="aktualizácia údajov zlyhala."
          />
        </Box>
      </Box>
    </Box>
  )
}

export default SettingsCoach
