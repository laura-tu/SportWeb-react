import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchUCoachByUserId } from '../coach'
import { useQueryClient } from '@tanstack/react-query'
import { updateCoachData } from '../coach'
import { useCallback } from 'react'

export const useCoachQuery = (userId: string) => {
  return useQuery({
    queryKey: ['coach', userId],
    queryFn: () => fetchUCoachByUserId(userId),
    enabled: !!userId,
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

const extractAthleteIds = (coachData: any): string[] => {
  return (coachData.athletes || []).map((a: any) => (typeof a === 'string' ? a : a.id))
}

export const useAddAthleteToCoach = (coachId: string, userId: string) => {
  const queryClient = useQueryClient()

  const coachQuery = useQuery({
    queryKey: ['coach', userId],
    queryFn: () => fetchUCoachByUserId(userId),
    enabled: !!userId,
  })

  const updateCoach = useMutation({
    mutationKey: ['update_coach_data', coachId],
    mutationFn: ({ updatedAthletes }: { updatedAthletes: string[] }) =>
      updateCoachData(coachId, { athletes: updatedAthletes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach', userId] })
    },
    onError: (error: any) => {
      console.error('Zlyhalo aktualizovanie zoznamu športovcov:', error.message)
    },
  })

  const addAthlete = useCallback(
    (athleteId: string) => {
      const coach = coachQuery
      if (!coach) return

      const existingIds = extractAthleteIds(coach)
      if (!existingIds.includes(athleteId)) {
        const updatedAthletes = [...existingIds, athleteId]
        updateCoach.mutate({ updatedAthletes })
      }
    },
    [coachQuery.data, updateCoach],
  )

  return {
    addAthlete,
    isPending: updateCoach.isPending,
    isCoachLoading: coachQuery.isLoading,
    coachError: coachQuery.error,
  }
}
