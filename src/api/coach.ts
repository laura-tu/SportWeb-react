import { ajax, ApiGetList } from '../utils/api'
import { UCoach } from '@/utils/payload/payload-types'
import { constructUrlWithParams } from '../utils/api'

const URL = 'api/u_coach'

export const getCoachData = async (coachId: string): Promise<UCoach> => {
  const url = constructUrlWithParams(`${URL}/${coachId}`, {})
  return ajax<UCoach>('GET', url)
}

export const fetchUCoachByUserId = async (userId: string): Promise<ApiGetList<UCoach>> => {
  const params = {
    limit: 1,
    where: {
      user: {
        equals: userId,
      },
    },
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<UCoach>>('GET', url)
}

export const updateCoachData = async (
  coachId: string,
  updateData: Record<string, any>,
): Promise<any> => {
  const url = constructUrlWithParams(`${URL}/${coachId}`, {})
  return ajax('PUT', url, updateData, {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })
}
