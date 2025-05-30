import { useQuery } from '@tanstack/react-query'
import { searchAthletesByName } from '../athlete'
import { UAthlete } from '@/utils/payload/payload-types'

export const useSearchAthletes = (searchQuery: string) => {
  return useQuery<UAthlete[], Error>({
    queryKey: ['searchAthletes', searchQuery],
    queryFn: () => searchAthletesByName(searchQuery),
    enabled: false,
  })
}
