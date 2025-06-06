import { ajax, ApiGetList, constructUrlWithParams, ApiResponse } from '../utils/api'
import { UAthlete } from '@/utils/payload/payload-types'
import { AthleteFormData } from '@/components/registration/athlete-registration'

const URL = 'api/u_athlete'

export const searchAthletesByName = async (query: string): Promise<UAthlete[]> => {
  try {
    const params = {
      where: {
        name: {
          contains: query,
        },
      },
    }

    const url = constructUrlWithParams(URL, params)
    const response = await ajax<ApiGetList<UAthlete>>('GET', url)

    return response?.docs || []
  } catch (error: any) {
    console.error('Chyba pri načítaní športovcov podla mena:', error.message)
    throw new Error('Nepodarilo sa načítať športovcov. Prosím skúste to znovu neskôr.')
  }
}

export const fetchAthleteByUserId = async (userId: string): Promise<UAthlete | null> => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token sa nenašiel')

  const params = {
    limit: 1,
    //depth: 1,
    where: {
      user: {
        equals: userId,
      },
    },
  }

  const url = constructUrlWithParams(URL, params)
  const response = await ajax<ApiGetList<UAthlete>>('GET', url, undefined, {
    Authorization: `Bearer ${token}`,
  })

  return response.docs?.[0] ?? null
}

export interface AthleteIdResponse {
  docs: UAthlete[]
}

export const createAthlete = async (
  data: AthleteFormData,
  userId: string,
): Promise<ApiResponse<UAthlete>> => {
  const birth_date = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`
  const { day, month, year, ...rest } = data

  const payload = { ...rest, birth_date, user: userId }

  return ajax<ApiResponse<UAthlete>>('POST', 'api/u_athlete', payload)
}

export const updateAthleteData = async (
  athleteId: string,
  updateData: Partial<UAthlete>,
): Promise<ApiResponse<UAthlete>> => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token sa nenašiel')

  return ajax<ApiResponse<UAthlete>>('PATCH', `api/u_athlete/${athleteId}`, updateData, {
    Authorization: `Bearer ${token}`,
  })
}
