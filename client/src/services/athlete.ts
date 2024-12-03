import axios from 'axios'
import { AthleteFormData } from '../components/athlete-reg/index.tsx'
import { Athlete } from '../utils/interfaces.ts'
import { stringify } from 'qs-esm'

export interface AthleteIdResponse {
  docs: Athlete[]
}

export const registerAthlete = async (
  data: AthleteFormData,
  userId: string,
  setSuccessModalVisible: (value: boolean) => void,
  setErrorModal: (value: boolean) => void,
) => {
  try {
    if (data.year && data.month && data.day) {
      data.birth_date = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`
    }

    delete data.day
    delete data.month
    delete data.year

    data.user = userId

    await axios.post('http://localhost:3000/api/u_athlete', data)
    setSuccessModalVisible(true)
  } catch (error) {
    console.error(error.message)
    setErrorModal(true)
  }
}
export const searchAthletesByName = async (query: string): Promise<Athlete[]> => {
  try {
    const stringifiedParams = stringify(
      { where: { name: { equals: query } } },
      { addQueryPrefix: true },
    )

    const response = await fetch(`http://localhost:3000/api/u_athlete${stringifiedParams}`)

    const data = await response.json()

    return data?.docs || []
  } catch (error) {
    console.error('Error fetching athletes by name:', error.message)
    throw new Error('Failed to fetch athletes. Please try again later.')
  }
}

export const fetchAthleteByUserId = async (userId: string): Promise<AthleteIdResponse> => {
  const response = await axios.get(`http://localhost:3000/api/u_athlete`)
  const athletes = response.data.docs

  const filteredAthlete = athletes.find((athlete: Athlete) => {
    if (typeof athlete.user === 'object' && 'id' in athlete.user) {
      return athlete.user.id === userId
    } else {
      return athlete.user === userId
    }
  })

  return { docs: filteredAthlete ? [filteredAthlete] : [] }
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
    throw new Error(error.response?.data?.message || 'Failed to update athlete data')
  }
}
