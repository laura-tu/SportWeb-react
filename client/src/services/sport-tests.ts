import axios from 'axios'
import type { TestResult } from '../utils/interfaces.ts'

export interface TestResultResponse {
  docs: TestResult[]
}

export const fetchTestResults = async (): Promise<TestResultResponse> => {
  const response = await axios.get('http://localhost:3000/api/test_results')

  return response.data
}

export const fetchTestResultsByAthleteId = async (
  athleteId: string,
): Promise<TestResultResponse> => {
  const response = await axios.get(`http://localhost:3000/api/test_results`)
  const testResults = response.data.docs

  const filteredTestResults = testResults.filter((testResult: TestResult) => {
    if (typeof testResult.athlete === 'object' && 'id' in testResult.athlete) {
      return testResult.athlete.id === athleteId
    } else {
      return testResult.athlete === athleteId
    }
  })

  return { docs: filteredTestResults ? [filteredTestResults] : [] }
}
