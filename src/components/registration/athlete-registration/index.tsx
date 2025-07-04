import React, { useState } from 'react'
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import ErrorModal from '../../error-modal/index'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SuccessModal from '../../success-modal/index'
import Box from '@/components/box'
import LoadingSpinner from '@/components/loading/loading-spinner'
import { useFetchSportClubs } from '@/api/hooks/useFetchSportClubs'
import { useFetchSports } from '@/api/hooks/useFetchSports'
import { useCreateAthlete } from '@/api/hooks/useAthleteQuery'

export interface AthleteFormData {
  day: number | null
  month: number | null
  year: number | null
  birth_date: string //formatted day,month,year
  gender: string
  sport: string[]
  club?: string
  user?: string
}

const AthleteRegistration = ({ userId, onClose }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModal, setErrorModal] = useState(false)

  const { data: sportsData, isLoading: isLoadingSports, error: sportsError } = useFetchSports()

  const { data: clubsData, isLoading: isLoadingClubs, error: clubsError } = useFetchSportClubs()

  const sportsOptions = sportsData?.docs || []
  const clubOptions = clubsData?.docs || []

  const { control, handleSubmit, setValue } = useForm<AthleteFormData>()

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const genders = [
    { label: 'Muž', value: 'muz' },
    { label: 'Žena', value: 'zena' },
  ]

  const { mutate: registerAthlete, isPending } = useCreateAthlete(
    userId,
    () => setSuccessModalVisible(true),
    () => setErrorModal(true),
  )

  const onSubmit = (data: AthleteFormData) => {
    registerAthlete(data)
  }

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false)
    onClose() // Close the entire AthleteReg component
  }

  if (isLoadingSports || isLoadingClubs) {
    return <LoadingSpinner />
  }

  if (sportsError || clubsError) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-red-600">
          <p>Chyba pri načítavaní športov alebo klubov.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg border border-black relative">
        <div className="headerX flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black text-bold ">Informácie o športovcovi</h1>
          <button className="text-red-600 text-2xl hover:cursor-pointer" onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputLabel>Dátum narodenia:</InputLabel>
          <Box direction="row" className="gap-2">
            <FormControl fullWidth className="flex">
              <InputLabel>Deň</InputLabel>
              <Controller
                name="day"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Deň"
                    value={field.value ?? ''}
                    required
                    onChange={e => {
                      const value = Number(e.target.value)
                      setValue('day', isNaN(value) ? null : value)
                    }}
                  >
                    {days.map(day => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth className="flex">
              <InputLabel>Mesiac</InputLabel>
              <Controller
                name="month"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Mesiac"
                    value={field.value ?? ''}
                    required
                    onChange={e => {
                      const value = Number(e.target.value)
                      setValue('month', isNaN(value) ? null : value)
                    }}
                  >
                    {months.map(month => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth className="flex">
              <InputLabel>Rok</InputLabel>
              <Controller
                name="year"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Rok"
                    value={field.value ?? ''}
                    required
                    onChange={e => {
                      const value = Number(e.target.value)
                      setValue('year', isNaN(value) ? null : value)
                    }}
                  >
                    {years.map(year => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Box>

          <div className="flex flex-col gap-2">
            <InputLabel id="gender-id">Pohlavie:</InputLabel>
            <FormControl fullWidth>
              <Controller
                name="gender"
                control={control}
                defaultValue={undefined}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="gender-id"
                    value={field.value ?? ''}
                    required
                    onChange={e => {
                      setValue('gender', e.target.value)
                    }}
                  >
                    {genders.map(gender => (
                      <MenuItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>

          <div className="flex flex-col gap-2">
            <InputLabel id="sport-id">Venujem sa športu (športom):</InputLabel>
            <FormControl fullWidth>
              <Controller
                name="sport"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="sport"
                    labelId="sport-id"
                    multiple
                    value={field.value || []}
                    required
                    onChange={e => {
                      const selectedSportIds = e.target.value as string[]
                      if (selectedSportIds.length <= 3) {
                        setValue('sport', selectedSportIds)
                      }
                    }}
                  >
                    {sportsOptions.map(sport => (
                      <MenuItem key={sport.id} value={sport.id}>
                        {sport.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>

          <div className="flex flex-col gap-2">
            <InputLabel id="club-id">Názov klubu:</InputLabel>
            <FormControl fullWidth>
              <Controller
                name="club"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="club-id"
                    onChange={e => setValue('club', e.target.value)}
                  >
                    {clubOptions.map(club => (
                      <MenuItem key={club.id} value={club.id}>
                        {club.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={isPending}
              className="text-white py-2 px-4 rounded hover:bg-green-600"
            >
              {isPending ? 'Registrujem...' : 'ZAREGISTROVAŤ SA'}
            </Button>
          </div>
        </form>
      </div>

      <SuccessModal
        open={successModalVisible}
        onClose={handleCloseSuccessModal}
        text="Boli ste úspešne zaregistrovaný"
      />

      <ErrorModal
        onClose={() => setErrorModal(false)}
        text="Niečo sa pokazilo počas registrácie. Skúste to znova neskôr!"
        open={errorModal}
      />
    </div>
  )
}

export default AthleteRegistration
