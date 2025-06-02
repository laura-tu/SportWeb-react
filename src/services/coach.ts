import axios from 'axios'
import { CoachFormData } from '../components/registration/coach-registration/index'
import { Coach } from '../utils/interfaces'

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

export const getCoachData = async (coachId: string): Promise<Coach> => {
  try {
    const response = await axios.get(`http://localhost:3000/api/u_coach/${coachId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching coach data:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch coach data')
  }
}

export const fetchCoachByAthleteId = async (athleteId: string): Promise<CoachIdResponse> => {
  try {
    const response = await axios.get(`http://localhost:3000/api/u_coach`, {
      params: {
        where: {
          athletes: {
            equals: athleteId,
          },
        },
        depth: 1,
      },
    })
    if (response.data?.docs?.length > 0) {
      return response.data
    }

    return {
      docs: [],
    }
  } catch (error) {
    console.error('Error fetching coach by athlete ID:', error)
    throw new Error(error.response?.data?.message || 'Failed to fetch coach by athlete ID')
  }
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
