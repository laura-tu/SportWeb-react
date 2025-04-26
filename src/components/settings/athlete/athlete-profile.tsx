import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { Box, Typography, CircularProgress } from '@mui/material'
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
    <FormProvider {...methods}>
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
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => (
                      <FormControl>
                        <FormField
                          control={methods.control}
                          name="birth_date"
                          render={({ field }) => (
                            <FormItem className="w-[20rem]">
                              <FormLabel>Pohlavie</FormLabel>
                              <Input
                                id="birth_date"
                                type="date"
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                                readOnly
                                className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md w-full px-4 py-2 focus:ring-2 focus:ring-blue-500"
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
                    render={({ field }) => (
                      <div className="space-y-2">
                        <FormControl>
                          <FormField
                            control={methods.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem className="w-[20rem]">
                                <FormLabel>Pohlavie</FormLabel>
                                <Input
                                  id="gender"
                                  type="text"
                                  value={field.value === 'zena' ? 'žena' : 'muž'}
                                  readOnly
                                  className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md w-full px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </FormControl>
                      </div>
                    )}
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <Controller
                    name="sport"
                    control={control}
                    render={({ field }) => (
                      <SportSelect selectedSports={field.value} onChange={field.onChange} />
                    )}
                  />

                  <Controller
                    name="club"
                    control={control}
                    render={({ field }) => (
                      <ClubSelect selectedClub={field.value} onChange={field.onChange} />
                    )}
                  />
                  {athlete?.id && coach && (
                    <div className="space-y-2">
                      <FormControl>
                        <FormField
                          control={methods.control}
                          name="coach"
                          render={({ field }) => (
                            <FormItem className="w-[20rem]">
                              <FormLabel>Tréner</FormLabel>
                              <Input
                                id="coach"
                                type="text"
                                value={coach?.name || '-'}
                                readOnly
                                className="bg-gray-100 text-gray-700 border border-gray-300 rounded-md w-full px-4 py-2 focus:ring-2 focus:ring-blue-500"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </FormControl>
                    </div>
                  )}
                </div>
              </Box>
              <Button
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Ukladám...
                  </Box>
                ) : (
                  'Uložiť zmeny'
                )}
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
    </FormProvider>
  )
}

export default AthleteProfile
