import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { searchAthletesByName } from '../athlete'
import { UAthlete } from '@/utils/payload/payload-types'
import { fetchAthleteByUserId } from '../athlete'

export const useSearchAthletes = (searchQuery: string) => {
  return useQuery<UAthlete[], Error>({
    queryKey: ['searchAthletes', searchQuery],
    queryFn: () => searchAthletesByName(searchQuery),
    enabled: false,
  })
}

export const useFetchAthlete = (
  userId: string,
  options?: Partial<UseQueryOptions<UAthlete, Error, UAthlete, [string, string]>>,
) => {
  return useQuery<UAthlete, Error, UAthlete, [string, string]>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
    enabled: !!userId,
    ...options,
  })
}
