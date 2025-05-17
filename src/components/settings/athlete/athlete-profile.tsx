import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { Typography } from '@mui/material'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import useFetchAthlete from '../hooks/useFetchAthlete'
import useFetchCoach from '../hooks/useFetchCoach'
import SuccessModal from '../../success-modal/index'
import ErrorModal from '../../error-modal/index'
import { formatDateForInput } from '../../../utils/formatDate'
import { updateAthleteData } from '../../../services/athlete'
import SettingsUser from '../user/index'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SportSelect from '@/components/select-popover/sport-select'
import ClubSelect from '@/components/select-popover/club-select'
import LoadingSpinner from '@/components/loading/loading-spinner'
import Box from '@/components/box'
import { cn } from '@/lib/utils'
import CoachSelect from './coach-select'

interface AthleteFormData {
  birth_date: string
  gender: string
  sport: string[]
  club: string
  coach: string
}

const WIDTH = 'w-[23rem]'

const AthleteProfile = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const originalDataRef = useRef<AthleteFormData | null>(null)

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const methods = useForm<AthleteFormData>({
    defaultValues: {
      birth_date: '',
      gender: '',
      sport: [],
      club: '',
      coach: '',
    },
  })

  const { control, handleSubmit, setValue, watch } = methods

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { coach, isFetchingCoach } = useFetchCoach(athlete?.id)

  // Load athlete and coach data into form
  useEffect(() => {
    if (athlete) {
      const initialData = {
        birth_date: athlete.birth_date ? formatDateForInput(athlete.birth_date) : '',
        gender: athlete.gender || '',
        sport: athlete.sport.map(s => s.id) || [],
        club: typeof athlete.club === 'string' ? athlete.club : athlete.club?.id || '',
        coach: coach?.name || '',
      }

      // Set default values into the form
      Object.keys(initialData).forEach(key => {
        setValue(key as keyof AthleteFormData, initialData[key as keyof AthleteFormData])
      })

      originalDataRef.current = initialData
    }
  }, [athlete, coach, setValue])

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

    for (const key in watch()) {
      if (watch()[key] !== originalDataRef.current[key]) {
        modifiedData[key] = watch()[key]
      }
    }

    return modifiedData
  }

  const onSubmit = () => {
    const modifiedData = getModifiedData()

    if (Object.keys(modifiedData).length === 0) {
      console.error('Žiadne zmeny.')
      return
    }

    mutation.mutate({
      athleteId: athlete?.id,
      updateData: modifiedData,
    })
  }

  if (isFetchingAthleteId || isFetchingCoach) return <LoadingSpinner />

  if (athleteError)
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        {athleteError.message} Nepodarilo sa načítať údaje trénera. Skúste to znova neskôr.
      </Typography>
    )

  return (
    <FormProvider {...methods}>
      <Box className="box-border w-[60vw]" direction="col">
        <Box direction="col" className="w-full ">
          <Box className="ml-10 w-[80%] sm:w-[60%] md:w-auto lg:w-[700px]">
            <SettingsUser userId={userId} />
          </Box>

          <Box
            direction="col"
            className="h-[85vh] mt-10 ml-10 text-left w-[75%] sm:w-[65%] md:w-[300px] lg:w-[700px] "
          >
            {/*<Typography variant="h5">Športovec</Typography>*/}

            <Box direction="col" className="mt-2 gap-6">
              {/* Birth Date and Gender */}
              <Box direction="row" className="gap-4">
                <Controller
                  name="birth_date"
                  control={control}
                  render={() => (
                    <FormControl>
                      <FormField
                        control={methods.control}
                        name="birth_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg">Dátum narodenia</FormLabel>
                            <Input
                              id="birth_date"
                              type="date"
                              value={field.value}
                              onChange={e => field.onChange(e.target.value)}
                              readOnly
                              className={cn('text-gray-700 cursor-not-allowed text-lg', WIDTH)}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="gender"
                  control={control}
                  render={() => (
                    <div className="space-y-2">
                      <FormControl>
                        <FormField
                          control={methods.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem className={WIDTH}>
                              <FormLabel className="text-lg">Pohlavie</FormLabel>
                              <Input
                                id="gender"
                                type="text"
                                value={field.value === 'zena' ? 'žena' : 'muž'}
                                readOnly
                                className=" text-gray-700 cursor-not-allowed text-lg"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </FormControl>
                    </div>
                  )}
                />
              </Box>

              {/* Sport, Club and Coach */}
              <Box direction="row" className="flex mb-6 gap-4">
                <Box direction="col" className="gap-2">
                  <FormLabel className="text-lg">Športy:</FormLabel>
                  <Controller
                    name="sport"
                    control={control}
                    render={({ field }) => (
                      <SportSelect selectedSports={field.value} onChange={field.onChange} />
                    )}
                  />
                </Box>

                <Box direction="col" className="flex gap-2">
                  <FormLabel className="text-lg">Športový klub:</FormLabel>
                  <Controller
                    name="club"
                    control={control}
                    render={({ field }) => (
                      <ClubSelect selectedClub={field.value} onChange={field.onChange} />
                    )}
                  />
                </Box>

                {athlete?.id && coach && (
                  <div className="space-y-2">
                    <Box direction="col" className="flex gap-2">
                      <FormLabel className="text-lg">Tréner:</FormLabel>
                      <Controller
                        name="coach"
                        control={control}
                        render={({ field }) => (
                          <CoachSelect coachName={coach?.name || 'Žiadny tréner'} />
                        )}
                      />
                    </Box>
                  </div>
                )}
              </Box>
            </Box>
            <Button
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={mutation.isPending}
              className="w-fit"
            >
              {mutation.isPending ? <LoadingSpinner small /> : 'Uložiť zmeny'}
            </Button>
          </Box>
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
    </FormProvider>
  )
}

export default AthleteProfile
