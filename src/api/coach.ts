import { ajax, ApiGetList, ApiResponse } from '../utils/api'
import { UCoach } from '@/utils/payload/payload-types'
import { constructUrlWithParams } from '../utils/api'
import { CoachFormData } from '../components/registration/coach-registration/index'

const URL = 'api/u_coach'

export const getCoachData = async (coachId: string): Promise<UCoach> => {
  const url = constructUrlWithParams(`${URL}/${coachId}`, {})
  return ajax<UCoach>('GET', url)
}

export const fetchUCoachByUserId = async (userId: string): Promise<UCoach | null> => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token sa nenašiel')

  const params = {
    limit: 1,
    where: {
      user: { equals: userId },
    },
  }

  const url = constructUrlWithParams(URL, params)

  const response = await ajax<ApiGetList<UCoach>>('GET', url, undefined, {
    Authorization: `Bearer ${token}`,
  })

  return response.docs?.[0] ?? null
}

export const updateCoachData = async (
  coachId: string,
  updateData: Record<string, any>,
): Promise<any> => {
  const url = constructUrlWithParams(`${URL}/${coachId}`, {})
  return ajax('PATCH', url, updateData, {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })
}

export const fetchCoachByAthleteId = async (athleteId: string): Promise<UCoach | null> => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token sa nenašiel')

  const params = {
    limit: 1,
    depth: 1,
    where: {
      athletes: {
        contains: athleteId,
      },
    },
  }

  const url = constructUrlWithParams(URL, params)

  const response = await ajax<ApiGetList<UCoach>>('GET', url, undefined, {
    Authorization: `Bearer ${token}`,
  })

  return response.docs?.[0] ?? null
}

export const createCoach = async (
  data: CoachFormData,
  userId: string,
): Promise<ApiResponse<UCoach>> => {
  data.user = userId

  return ajax<ApiResponse<UCoach>>('POST', URL, data)
}
