import { useQuery } from '@tanstack/react-query'
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

export const useFetchAthlete = (userId: string) => {
  return useQuery({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
    enabled: !!userId,
  })
}
