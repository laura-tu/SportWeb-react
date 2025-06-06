import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query'
import { fetchUCoachByUserId } from '../coach'
import { useQueryClient } from '@tanstack/react-query'
import { updateCoachData, fetchCoachByAthleteId } from '../coach'
import { UCoach } from '@/utils/payload/payload-types'

export const useCoachQuery = (
  userId: string,
  options?: Partial<UseQueryOptions<UCoach, Error, UCoach, [string, string]>>,
) => {
  return useQuery({
    queryKey: ['coach', userId],
    queryFn: () => fetchUCoachByUserId(userId),
    enabled: !!userId,
    ...options,
  })
}

export const useUpdateCoach = (coachId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['update_coach_data', coachId],
    mutationFn: (updateData: Record<string, any>) => updateCoachData(coachId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach', coachId] })
    },
    onError: (error: any) => {
      console.error('Zlyhala aktualizácia údajov trénera:', error.message)
    },
  })
}

export const useAddAthleteToCoach = (coachId: string, userId: string) => {
  const queryClient = useQueryClient()

  const { data: coach } = useCoachQuery(userId)

  const mutation = useMutation({
    mutationKey: ['add_athlete_to_coach', coachId],
    mutationFn: async (athleteId: string) => {
      if (!coach) throw new Error('Coach nebol nájdený')

      const currentAthletes = coach.athletes || []

      const athleteIds = currentAthletes.map(a => (typeof a === 'string' ? a : a.id))

      // Zamedzenie duplicite
      if (athleteIds.includes(athleteId)) return

      const updatedAthletes = [...athleteIds, athleteId]

      return updateCoachData(coachId, { athletes: updatedAthletes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach', userId] })
    },
    onError: (error: any) => {
      console.error('Zlyhalo pridanie športovca:', error.message)
    },
  })

  return {
    addAthlete: mutation.mutate,
    isPending: mutation.isPending,
    coachError: mutation.error,
  }
}

export const useFetchCoachByAthleteId = (athleteId?: string) => {
  const {
    data: coach,
    isLoading: isFetchingCoach,
    error: coachError,
  } = useQuery<UCoach | null>({
    queryKey: ['coach', athleteId],
    queryFn: () => {
      if (!athleteId) {
        return Promise.reject(new Error('Nie je dostupné žiadne ID športovca'))
      }
      return fetchCoachByAthleteId(athleteId)
    },
    enabled: !!athleteId,
  })

  return { coach, isFetchingCoach, coachError }
}
