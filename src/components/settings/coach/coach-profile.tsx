import React, { useState, useEffect } from 'react'
import { FormLabel } from '@/components/ui/form'
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
import { useForm, FormProvider } from 'react-hook-form'

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

  const methods = useForm<CoachFormData>({
    defaultValues: {
      sport: [],
      sport_club: '',
    },
  })

  const {
    data: coachData,
    isLoading: isFetchingCoachId,
    error: coachIdError,
  } = useQuery<CoachIdResponse>({
    queryKey: ['coachId', userId],
    queryFn: () => fetchCoachByUserId(userId),
    refetchOnMount: true, // ensures fresh data every time it's shown
    refetchOnWindowFocus: true, // optional
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
  }, [coach?.id])

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
    <FormProvider {...methods}>
      <Box direction="col" className=" w-[60vw] h-screen">
        {/* User Settings Section */}
        <Box className="ml-10 w-[80%] sm:w-[60%] md:w-auto lg:w-[700px]">
          <SettingsUser userId={userId} />
        </Box>

        {/* Coach Information Section */}
        <Box
          direction="col"
          className="h-[85vh] mt-10 ml-10 text-left w-[75%] sm:w-[65%] md:w-[300px] lg:w-[700px]"
        >
          <Box direction="col" className="mb-6 gap-6">
            <Box direction="row" className="relative gap-4">
              <Box direction="col" className=" gap-2">
                <FormLabel>Športy:</FormLabel>
                <SportSelect
                  selectedSports={formData.sport}
                  onChange={value => handleInputChange('sport', value)}
                />
              </Box>

              <Box direction="col" className="flex gap-2">
                <FormLabel>Športový klub:</FormLabel>
                <ClubSelect
                  selectedClub={formData.sport_club}
                  onChange={value => handleInputChange('sport_club', value)}
                />
              </Box>
            </Box>
          </Box>
          <Button onClick={handleSaveChanges} disabled={mutation.isPending} className="mt-4 w-fit">
            {mutation.isPending ? <LoadingSpinner small /> : 'Uložiť zmeny'}
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
          text="Aktualizácia údajov sa nepodarila. Skúste to znova neskôr."
        />
      </Box>
    </FormProvider>
  )
}

export default CoachProfile
