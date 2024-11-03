import React, { useState, useEffect } from 'react'
import { Select, MenuItem, InputLabel, FormControl, Button, Modal, Box } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import ErrorModal from '../error-modal/index.tsx'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { fetchSports } from '../../services/sports.ts'
import { fetchSportClubs } from '../../services/sport-clubs.ts'
import { registerCoach } from '../../services/coach.ts'

export interface CoachFormData {
  sport: string[]
  club?: string
  user?: string
}

interface SportOption {
  id: string
  name: string
}

const CoachReg = ({ userId, onClose }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [sportsOptions, setSportsOptions] = useState<SportOption[]>([])
  const [clubOptions, setClubOptions] = useState<SportOption[]>([])

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

  const { control, handleSubmit, setValue } = useForm<CoachFormData>()

  const onSubmit = async (data: CoachFormData) => {
    await registerCoach(data, userId, setSuccessModalVisible, setErrorModal)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <Box className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg border border-black relative">
        <div className="headerX flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-black text-bold ">Informácie o trénerovi</h1>
          <button className="text-red-600 text-2xl " onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" variant="contained" color="success" fullWidth>
            ZAREGISTROVAŤ SA
          </Button>
        </form>
      </Box>

      <Modal open={successModalVisible} onClose={() => setSuccessModalVisible(false)}>
        <Box className="bg-white rounded-lg p-4 max-w-sm text-center mx-auto">
          <h2 className="text-xl font-bold">Hotovo!</h2>
          <p>Boli ste úspešne zaregistrovaný</p>
          <Button onClick={() => setSuccessModalVisible(false)} variant="contained" color="primary">
            Zatvoriť
          </Button>
        </Box>
      </Modal>

      <ErrorModal
        onClose={() => setErrorModal(false)}
        text="registrácii"
        label="Chyba!"
        open={errorModal}
      />
    </div>
  )
}

export default CoachReg
