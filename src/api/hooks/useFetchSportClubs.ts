import { useQuery } from '@tanstack/react-query'
import { fetchSportClubs } from '@/api/sport-clubs'

export const useFetchSportClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: fetchSportClubs,
  })
}
