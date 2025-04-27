import React, { useState, useEffect } from 'react'
import { Typography } from '@mui/material'
import { Button } from '@/components/ui/button'
import { fetchCoachByUserId, CoachIdResponse, updateCoachData } from '../../../services/coach'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import LoadingSpinner from '../../loading/loading-spinner'
import SuccessModal from '../../success-modal/index'
import ErrorModal from '../../error-modal/index'
import SettingsUser from '../user/index'
import SportSelect from '@/components/select-popover/sport-select'
import ClubSelect from '@/components/select-popover/club-select'
import Box from '@/components/box'

interface CoachFormData {
  sport: string[]
  sport_club?: string
}

const CoachProfile: React.FC<{ userId: string }> = ({ userId }) => {
  const queryClient = useQueryClient()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
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

  const handleInputChange = (field: keyof CoachFormData, value: string | string[]) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: field === 'sport' ? (Array.isArray(value) ? value : [value]) : value,
    }))
  }

  const handleSaveChanges = () => {
    if (!coach) {
      console.error('Nie sú dostupné žiadne informácie o trénerovi k aktualizácii.')
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
    return <LoadingSpinner />
  }

  if (coachIdError) {
    return (
      <p>Chyba pri načítavaní informácií o trénerovi cez id používateľa: {coachIdError.message}</p>
    )
  }

  if (!coach) {
    return <p>Nebol nájdený tréner</p>
  }

  return (
    <Box direction="col" className="flex w-full h-screen p-4">
      {/* User Settings Section */}
      <Box direction="row" className="flex" style={{ width: '75%' }}>
        <SettingsUser userId={userId} />
      </Box>

      {/* Coach Information Section */}
      <Box
        direction="col"
        className="flex flex-col justify-center items-start py-4 px-3 mt-4 "
        style={{
          width: '50%',
          height: 'auto',
        }}
      >
        <Typography variant="h5" sx={{ textAlign: 'left', width: '100%', fontWeight: 600 }}>
          Informácie o trénerovi:
        </Typography>

        <Box direction="col" className="mt-3 w-full gap-3">
          <SportSelect
            selectedSports={formData.sport}
            onChange={value => handleInputChange('sport', value)}
          />

          <ClubSelect
            selectedClub={formData.sport_club}
            onChange={value => handleInputChange('sport_club', value)}
          />

          <Button onClick={handleSaveChanges} disabled={mutation.isPending} className="w-full mt-4">
            {mutation.isPending ? <LoadingSpinner small /> : 'Uložiť zmeny'}
          </Button>
        </Box>
      </Box>

      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        text="Údaje boli úspešne aktualizované!"
      />

      <ErrorModal
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        text="Aktualizácia údajov sa nepodarila. Skúste to znova neskôr."
      />
    </Box>
  )
}

export default CoachProfile
