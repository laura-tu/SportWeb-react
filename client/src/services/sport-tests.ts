import axios from 'axios'
import type { TestResult } from '../utils/interfaces.ts'
import { ApiGetList, constructUrlWithParams, ajax, BaseParams } from '../utils/api/index.ts'

export interface TestResultResponse {
  docs: TestResult[]
}

export const fetchTestResults = async (): Promise<TestResultResponse> => {
  const response = await axios.get('http://localhost:3000/api/test_results')

  return response.data
}

export const fetchTestResultsByAthleteId = async (
  athleteId: string,
  testType: string,
): Promise<TestResultResponse> => {
  const params: BaseParams = {
    where: {
      and: [{ athlete: { equals: athleteId } }, { 'testType.name': { equals: testType } }],
    },
  }

  const url = constructUrlWithParams('api/test_results', params)
  return ajax<ApiGetList<TestResult>>('GET', url)

  // const response = await axios.get('http://localhost:3000/' + url)
  // return response.data
}
