import React, { useState } from 'react'
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import ErrorModal from '../../error-modal/index'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { registerCoach } from '../../../services/coach'
import SuccessModal from '../../success-modal/index'
import Box from '@/components/box'
import { useFetchSports } from '@/api/hooks/useFetchSports'
import { useFetchSportClubs } from '@/api/hooks/useFetchSportClubs'
import LoadingSpinner from '@/components/loading/loading-spinner'
import { ErrorMessage } from '@/components/error-message'

export interface CoachFormData {
  sport: string[]
  club?: string
  user?: string
}

const CoachRegistration = ({ userId, onClose }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModal, setErrorModal] = useState(false)

  const { data: sportsData, isLoading: isLoadingSports, error: sportsError } = useFetchSports()
  const { data: clubsData, isLoading: isLoadingClubs, error: clubsError } = useFetchSportClubs()

  const sportsOptions = sportsData?.docs || []
  const clubOptions = clubsData?.docs || []

  const { control, handleSubmit, setValue } = useForm<CoachFormData>()

  const onSubmit = async (data: CoachFormData) => {
    await registerCoach(data, userId, setSuccessModalVisible, setErrorModal)
  }

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false)
    onClose()
  }

  if (isLoadingSports || isLoadingClubs) return <LoadingSpinner />

  if (sportsError || clubsError) {
    return <ErrorMessage message="Nepodarilo sa načítať športy alebo kluby." />
  }

  return (
    <Box direction="col" className="fixed inset-0 bg-black/70 items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg border border-black relative">
        <Box direction="row" className="headerX justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black text-bold ">Informácie o trénerovi</h1>
          <button className="text-red-600 text-2xl  hover:cursor-pointer" onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Box direction="col" className="gap-2">
            <InputLabel id="sport-id">Venujem sa športu (športom):</InputLabel>
            <FormControl fullWidth>
              <Controller
                name="sport"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="sport-id"
                    multiple
                    required
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
          </Box>

          <Box direction="col" className="gap-2">
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
          </Box>
          <div className="mt-8">
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              className=" text-white py-2 px-4 rounded hover:bg-green-600"
            >
              ZAREGISTROVAŤ SA
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
    </Box>
  )
}

export default CoachRegistration
