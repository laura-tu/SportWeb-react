import { useQuery } from '@tanstack/react-query'
import { UAthlete } from '@/utils/payload/payload-types'
import { fetchAthleteByUserId } from '../athlete'

export const useAthleteDetailQuery = (userId: string | undefined) => {
  return useQuery<UAthlete | null>({
    queryKey: ['athlete-detail', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve(null)
      return fetchAthleteByUserId(userId)
    },
    enabled: !!userId,
  })
}
