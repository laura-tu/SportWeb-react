import { useQuery } from '@tanstack/react-query'
import { fetchUser } from '../../services/user'

const useFetchUserById = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId, // Only fetch if userId exists
  })
}

export default useFetchUserById
