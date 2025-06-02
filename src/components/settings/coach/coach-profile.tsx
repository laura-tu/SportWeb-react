import React, { useState, useEffect } from 'react'
import { FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useCoachQuery } from '@/api/hooks/useCoachQuery'
import { useUpdateCoach } from '@/api/hooks/useCoachQuery'
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
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const { data: coach, isLoading, error } = useCoachQuery(userId)

  const methods = useForm<CoachFormData>({
    defaultValues: {
      sport: [],
      sport_club: '',
    },
  })

  useEffect(() => {
    if (coach) {
      methods.reset({
        sport: coach.sport.map(s => (typeof s === 'string' ? s : s.id)),
        sport_club: typeof coach.club === 'string' ? coach.club : coach.club?.id || '',
      })
    }
  }, [coach, methods])

  const mutation = useUpdateCoach(coach?.id ?? '')

  const handleSaveChanges = () => {
    if (!coach) {
      console.error('Nie sú dostupné žiadne informácie o trénerovi k aktualizácii.')
      return
    }

    const modifiedData = methods.getValues()

    mutation.mutate(modifiedData, {
      onSuccess: () => setSuccessModalOpen(true),
      onError: () => setErrorModalOpen(true),
    })
  }

  if (isLoading && !coach) {
    return (
      <Box className="w-full h-screen flex justify-center items-center">
        <LoadingSpinner />
      </Box>
    )
  }

  if (error) {
    return (
      <p>
        Chyba pri načítavaní informácií o trénerovi cez ID používateľa: {(error as Error).message}
      </p>
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
                <FormLabel className="text-lg">Športy:</FormLabel>
                <SportSelect
                  selectedSports={methods.watch('sport')}
                  onChange={value =>
                    methods.setValue('sport', Array.isArray(value) ? value : [value])
                  }
                />
              </Box>

              <Box direction="col" className="flex gap-2">
                <FormLabel className="text-lg">Športový klub:</FormLabel>
                <ClubSelect
                  selectedClub={methods.watch('sport_club')}
                  onChange={value => methods.setValue('sport_club', value)}
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
