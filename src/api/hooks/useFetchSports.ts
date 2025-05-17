import { useQuery } from '@tanstack/react-query'
import { fetchSports } from '@/api/sports'

export const useFetchSports = () => {
  return useQuery({
    queryKey: ['sports'],
    queryFn: fetchSports,
  })
}
