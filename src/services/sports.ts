import { ajax, ApiGetList } from '../utils/api'
import { Sport } from '../utils/interfaces'
import { constructUrlWithParams } from '../utils/api'

const URL = 'api/c_sport'

export const fetchSports = async (): Promise<ApiGetList<Sport>> => {
  const params = {
    limit: 0, // no limit in PayloadCMS, adjust as needed
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<Sport>>('GET', url)
}
