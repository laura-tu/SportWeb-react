import { ajax, ApiGetList, constructUrlWithParams } from '../utils/api'
import { UAthlete } from '@/utils/payload/payload-types'

const URL = 'api/u_athlete'

export const searchAthletesByName = async (query: string): Promise<UAthlete[]> => {
  try {
    const params = {
      where: {
        name: {
          equals: query,
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
