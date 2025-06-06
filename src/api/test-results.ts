import { ajax, ApiGetList, constructUrlWithParams } from '../utils/api'
import type { TestResult } from '../utils/payload/payload-types'

const URL = 'api/test_results'

export const getAllTestResults = async (): Promise<ApiGetList<TestResult>> => {
  return ajax<ApiGetList<TestResult>>('GET', URL)
}

export const getTestResultsByAthleteAndType = async (
  athleteId: string,
  testType: string,
): Promise<ApiGetList<TestResult>> => {
  const params = {
    where: {
      and: [{ athlete: { equals: athleteId } }, { 'testType.name': { equals: testType } }],
    },
    limit: 0, // vráti všetky
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<TestResult>>('GET', url)
}

export const getTestResultsByAthleteId = async (
  athleteId: string,
): Promise<ApiGetList<TestResult>> => {
  const params = {
    where: {
      athlete: { equals: athleteId },
    },
    limit: 0, // vráti všetky
  }

  const url = constructUrlWithParams(URL, params)
  return ajax<ApiGetList<TestResult>>('GET', url)
}
