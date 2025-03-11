import { useQuery } from '@tanstack/react-query'
import { fetchTestResultsByAthleteId } from '../../../services/sport-tests'
import type { TestResult } from '../../../utils/payload/payload-types'

export interface TestResultResponse {
  docs: TestResult[]
}

const useFetchTestResults = (testType: string, athleteId?: string) => {
  const {
    data: testResultsData,
    isLoading,
    error,
  } = useQuery<TestResultResponse>({
    queryKey: ['testResults', athleteId, testType],
    queryFn: () => {
      if (athleteId) {
        return fetchTestResultsByAthleteId(athleteId, testType)
      }
      return Promise.reject('Nie je dostupné žiadne ID športovca')
    },
    enabled: !!athleteId,
  })
  const testResults = testResultsData?.docs ?? []

  return { testResults, isFetchingTestResults: isLoading, testResultsError: error }
}

export default useFetchTestResults
