import { useQuery } from '@tanstack/react-query'
import { fetchUserData } from '../fetchUserData'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchUserData,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
