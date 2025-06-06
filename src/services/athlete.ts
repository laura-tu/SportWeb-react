import axios from 'axios'
import { AthleteFormData } from '../components/registration/athlete-registration/index.js'
import type { UAthlete } from '@/utils/payload/payload-types.js'

export interface AthleteIdResponse {
  docs: UAthlete[]
}

export const registerAthlete = async (
  data: AthleteFormData,
  userId: string,
  setSuccessModalVisible: (value: boolean) => void,
  setErrorModal: (value: boolean) => void,
) => {
  try {
    // Format the birth_date using day, month, and year
    const birth_date = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`

    // Create a new object without day, month, and year
    const { day, month, year, ...rest } = data

    // Add birth_date and user to the new object
    const payload = { ...rest, birth_date, user: userId }

    await axios.post('http://localhost:3000/api/u_athlete', payload)

    setSuccessModalVisible(true)
  } catch (error) {
    console.error(error.message)
    setErrorModal(true)
  }
}


export const updateAthleteData = async (athleteId: string, updateData: Record<string, any>) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/u_athlete/${athleteId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
    return response.data
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Nepodarilo sa aktualizovať údaje o športovcovi',
    )
  }
}
