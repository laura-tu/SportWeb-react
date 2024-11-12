import axios from 'axios'
import { CoachFormData } from '../components/coach-reg/index.tsx'
import { Coach } from '../utils/interfaces.ts'

export interface CoachIdResponse {
  docs: Coach[]
}

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

export const fetchCoachByUserId = async (userId: string): Promise<CoachIdResponse> => {
  const response = await axios.get(`http://localhost:3000/api/u_coach`)
  const coaches = response.data.docs

  const filteredCoach = coaches.find((coach: Coach) => {
    if (typeof coach.user === 'object' && 'id' in coach.user) {
      return coach.user.id === userId
    } else {
      return coach.user === userId
    }
  })

  return { docs: filteredCoach ? [filteredCoach] : [] }
}
