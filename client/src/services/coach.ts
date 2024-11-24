import axios from 'axios'
import { CoachFormData } from '../components/coach-reg/index.tsx'
import { Coach, Athlete, Sport, Club } from '../utils/interfaces.ts'

export interface CoachIdResponse {
  docs: Coach[]
}

export interface CoachResponse {
  id: string
  user: string
  sport: Sport[]
  club: Club
  athlete: Athlete[]
  createdAt: string
  updatedAt: string
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

export const getCoachData = async (coachId: string): Promise<CoachResponse> => {
  try {
    const response = await axios.get(`http://localhost:3000/api/u_coach/${coachId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching coach data:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch coach data')
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

export const updateCoachData = async (coachId: string, updateData: Record<string, any>) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/u_coach/${coachId}`, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update athlete data')
  }
}
