import axios from 'axios'
import { CoachFormData } from '../components/coach-reg/index.tsx'

export const registerCoach = async (
  data: CoachFormData,
  userId: string,
  setSuccessModalVisible: (value: boolean) => void,
  setErrorModal: (value: boolean) => void,
) => {
  try {
    data.user = userId

    await axios.post('http://localhost:3000/api/u_coach', data)
    setSuccessModalVisible(true)
  } catch (error) {
    console.error(error.message)
    setErrorModal(true)
  }
}
