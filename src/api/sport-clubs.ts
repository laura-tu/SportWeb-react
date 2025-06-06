import { ajax, ApiGetList } from '../utils/api'
import { CSportClub } from '@/utils/payload/payload-types'
import { constructUrlWithParams } from '../utils/api'

const URL = 'api/c_sport_club'

export const fetchSportClubs = async (): Promise<ApiGetList<CSportClub>> => {
  const params = {
    limit: 0, // fetch all clubs
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<CSportClub>>('GET', url)
}
