import { useQuery } from '@tanstack/react-query'
import { fetchAthleteByUserId, AthleteIdResponse } from '../../../services/athlete'
import { useRef } from 'react'

const useFetchAthlete = (userId: string) => {
  const originalDataRef = useRef<any>(null)

  const {
    data: athleteData,
    isLoading,
    error,
  } = useQuery<AthleteIdResponse>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
  })

  const athlete = athleteData?.docs[0]

  return { athlete, isFetchingAthleteId: isLoading, athleteError: error, originalDataRef }
}

export default useFetchAthlete
