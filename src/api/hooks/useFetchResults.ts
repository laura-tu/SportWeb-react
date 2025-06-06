import { useQuery } from '@tanstack/react-query'
import { getTestResultsByAthleteAndType, getTestResultsByAthleteId } from '../test-results'
import { TestResult } from '@/utils/payload/payload-types'
import { ApiGetList } from '@/utils/api'

export const useTestResultsByAthleteAndType = (testType: string, athleteId: string) => {
  return useQuery<ApiGetList<TestResult>>({
    queryKey: ['testResults', athleteId, testType],
    queryFn: () => getTestResultsByAthleteAndType(athleteId, testType),
    enabled: !!athleteId && !!testType,
  })
}

export const useTestResultsByAthleteId = (athleteId: string) => {
  return useQuery<ApiGetList<TestResult>>({
    queryKey: ['testResultsByAthlete', athleteId],
    queryFn: () => getTestResultsByAthleteId(athleteId),
    enabled: !!athleteId,
  })
}
