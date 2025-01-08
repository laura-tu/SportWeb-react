import { useQuery } from '@tanstack/react-query'
import { fetchTestResultsByAthleteId, TestResultResponse } from '../../../services/sport-tests.ts'

const useFetchTestResults = (athleteId?: string) => {
  const {
    data: testResultsData,
    isLoading,
    error,
  } = useQuery<TestResultResponse>({
    queryKey: ['testResults', athleteId],
    queryFn: () => {
      if (athleteId) {
        return fetchTestResultsByAthleteId(athleteId)
      }
      return Promise.reject('Nie je dostupné žiadne ID športovca')
    },
    enabled: !!athleteId,
  })

  const testResults = testResultsData?.docs

  return { testResults, isFetchingTestResults: isLoading, testResultsError: error }
}

export default useFetchTestResults
