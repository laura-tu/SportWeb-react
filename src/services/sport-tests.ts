import type { TestResult } from '../utils/payload/payload-types.ts'
import { ApiGetList, constructUrlWithParams, ajax, BaseParams } from '../utils/api/index.js'

const URL = 'api/test_results'

export const fetchTestResults = async (): Promise<ApiGetList<TestResult>> => {
  return ajax<ApiGetList<TestResult>>('GET', URL)
}

export const fetchTestResultsByAthleteId = async (
  athleteId: string,
  testType: string,
): Promise<ApiGetList<TestResult>> => {
  const params: BaseParams = {
    where: {
      and: [{ athlete: { equals: athleteId } }, { 'testType.name': { equals: testType } }],
    },
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<TestResult>>('GET', url)

  // const response = await axios.get('http://localhost:3000/' + url)
  // return response.data
}
