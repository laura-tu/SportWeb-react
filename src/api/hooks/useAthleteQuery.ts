import { useQuery } from '@tanstack/react-query'
import { searchAthletesByName } from '../athlete'
import { UAthlete } from '@/utils/payload/payload-types'
import { useRef } from 'react'
import { fetchAthleteByUserId } from '../athlete'

export const useSearchAthletes = (searchQuery: string) => {
  return useQuery<UAthlete[], Error>({
    queryKey: ['searchAthletes', searchQuery],
    queryFn: () => searchAthletesByName(searchQuery),
    enabled: false,
  })
}

export const useFetchAthlete = (userId: string) => {
  const originalDataRef = useRef<any>(null)

  const {
    data: athlete,
    isLoading: isFetchingAthleteId,
    error: athleteError,
  } = useQuery<UAthlete | null>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId), // must return UAthlete | null
  })

  return { athlete, isFetchingAthleteId, athleteError, originalDataRef }
}
