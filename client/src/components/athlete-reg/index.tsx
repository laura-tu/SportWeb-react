import React, { useState } from 'react'
import {
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Button,
  Modal,
  Box,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import ErrorModal from '../error-modal/index.tsx'

interface AthleteFormData {
  day: number | null
  month: number | null
  year: number | null
  gender: string
  sport: string[]
  club: string
  user_id?: string
}

const AthleteReg = ({ userId, formData, onClose }) => {
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModal, setErrorModal] = useState(false)

  const { control, handleSubmit, setValue, watch, register } = useForm<AthleteFormData>()

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const genders = ['Muž', 'Žena']
  const sportsOptions = [
    'Futbal',
    'Volejbal',
    'Basketbal',
    'Hokej',
    'Plávanie',
    'Atletika',
    'Gymnastika',
    'Cyklistika',
    'Posilovanie',
    'Iné',
  ]

  const registerAthlete = async (data: AthleteFormData) => {
    try {
      data.user_id = userId
      await axios.post('http://localhost:4000/api/athlete/post', data)
      setSuccessModalVisible(true)
    } catch (error) {
      setErrorModal(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <Box className="bg-gray-200 p-6 rounded-lg w-full max-w-md shadow-lg border border-black relative">
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <form onSubmit={handleSubmit(registerAthlete)} className="space-y-4">
          <InputLabel>Dátum narodenia:</InputLabel>
          <div className="flex space-x-2">
            <FormControl fullWidth>
              <InputLabel>Deň</InputLabel>
              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Deň"
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
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Mesiac"
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
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Rok"
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
              render={({ field }) => (
                <Select
                  {...field}
                  label="Pohlavie"
                  onChange={e => {
                    setValue('gender', e.target.value)
                  }}
                >
                  {genders.map(gender => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
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
              render={({ field }) => (
                <Select
                  {...field}
                  label="Šport"
                  multiple
                  value={field.value || []} // Controlled state
                  onChange={e => {
                    const selectedSports: string[] = e.target.value as string[] // Cast to string[]
                    if (selectedSports.length <= 3) {
                      setValue('sport', selectedSports)
                    }
                  }}
                >
                  {sportsOptions.map(sport => (
                    <MenuItem key={sport} value={sport}>
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <InputLabel>Názov klubu:</InputLabel>
          <TextField fullWidth label="Klub" {...register('club')} inputProps={{ maxLength: 40 }} />

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

      <ErrorModal onClose={() => setErrorModal(false)} text="registrácii" label="Chyba!"  open={errorModal}/>

    </div>
  )
}

export default AthleteReg
