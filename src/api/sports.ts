import { ajax, ApiGetList } from '../utils/api'
import { CSport } from '@/utils/payload/payload-types'
import { constructUrlWithParams } from '../utils/api'

const URL = 'api/c_sport'

export const fetchSports = async (): Promise<ApiGetList<CSport>> => {
  const params = {
    limit: 0, // no limit 
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<CSport>>('GET', url)
}
