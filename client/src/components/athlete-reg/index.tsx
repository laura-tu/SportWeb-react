import React, { useState, useEffect } from 'react'
import { Select, MenuItem, InputLabel, FormControl, Button, Box } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import ErrorModal from '../error-modal/index.tsx'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { fetchSports } from '../../services/sports.ts'
import { fetchSportClubs } from '../../services/sport-clubs.ts'
import { registerAthlete } from '../../services/athlete.ts'
import SuccessModal from '../success-modal/index.tsx'
import { Club, Sport } from '../../utils/interfaces.ts'

export interface AthleteFormData {
  day?: number | null
  month?: number | null
  year?: number | null
  birth_date?: string //formatted day,month,year
  gender: string
  sport: string[]
  club?: string
  user?: string
}

const AthleteReg = ({ userId, onClose }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [sportsOptions, setSportsOptions] = useState<Sport[]>([])
  const [clubOptions, setClubOptions] = useState<Club[]>([])

  useEffect(() => {
    const loadSports = async () => {
      const sports = await fetchSports()
      setSportsOptions(sports)
    }

    const loadSportClubs = async () => {
      const clubs = await fetchSportClubs()
      setClubOptions(clubs)
    }

    loadSports()
    loadSportClubs()
  }, [])

  const { control, handleSubmit, setValue } = useForm<AthleteFormData>()

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const genders = [
    { label: 'Muž', value: 'muz' },
    { label: 'Žena', value: 'zena' },
  ]

  const onSubmit = async (data: AthleteFormData) => {
    await registerAthlete(data, userId, setSuccessModalVisible, setErrorModal)
  }

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false)
    onClose() // Close the entire AthleteReg component
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <Box className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg border border-black relative">
        <div className="headerX flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-black text-bold ">Informácie o športovcovi</h1>
          <button className="text-red-600 text-2xl " onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputLabel>Dátum narodenia:</InputLabel>
          <div className="flex space-x-2">
            <FormControl fullWidth>
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

            <FormControl fullWidth>
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

            <FormControl fullWidth>
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
          </div>

          <InputLabel>Pohlavie:</InputLabel>
          <FormControl fullWidth>
            <Controller
              name="gender"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Pohlavie"
                  value={field.value ?? ''}
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

          <InputLabel>Venujem sa športu (športom):</InputLabel>
          <FormControl fullWidth>
            <Controller
              name="sport"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Šport"
                  multiple
                  value={field.value || []}
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

          <InputLabel>Názov klubu:</InputLabel>
          <FormControl fullWidth>
            <Controller
              name="club"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} label="Klub" onChange={e => setValue('club', e.target.value)}>
                  {clubOptions.map(club => (
                    <MenuItem key={club.id} value={club.id}>
                      {club.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            className=" text-white py-2 px-4 rounded hover:bg-green-600"
          >
            ZAREGISTROVAŤ SA
          </Button>
        </form>
      </Box>

      <SuccessModal
        open={successModalVisible}
        onClose={handleCloseSuccessModal}
        text="Boli ste úspešne zaregistrovaný"
      />

      <ErrorModal
        onClose={() => setErrorModal(false)}
        text="registrácii"
        label="Chyba!"
        open={errorModal}
      />
    </div>
  )
}

export default AthleteReg
