import { ajax, ApiGetList } from '../utils/api'
import { Club } from '../utils/interfaces'
import { constructUrlWithParams } from '../utils/api'

const URL = 'api/c_sport_club'

export const fetchSportClubs = async (): Promise<ApiGetList<Club>> => {
  const params = {
    limit: 0, // fetch all clubs
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<Club>>('GET', url)
}
