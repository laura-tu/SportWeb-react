import { ajax, ApiGetList, constructUrlWithParams } from '../utils/api'
import { UAthlete } from '@/utils/payload/payload-types'

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
