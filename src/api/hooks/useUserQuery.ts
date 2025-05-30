import { useQuery } from '@tanstack/react-query'
import { fetchUserData, fetchUser } from '../user'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchUserData,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useFetchUserById = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  })
}
