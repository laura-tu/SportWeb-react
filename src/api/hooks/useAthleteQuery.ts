import { useQuery, UseQueryOptions, useMutation } from '@tanstack/react-query'
import { searchAthletesByName, createAthlete, updateAthleteData } from '../athlete'
import { UAthlete } from '@/utils/payload/payload-types'
import { fetchAthleteByUserId } from '../athlete'
import { ApiResponse } from '@/utils/api'
import { AthleteFormData } from '@/components/registration/athlete-registration'

export const useSearchAthletes = (searchQuery: string) => {
  return useQuery<UAthlete[], Error>({
    queryKey: ['searchAthletes', searchQuery],
    queryFn: () => searchAthletesByName(searchQuery),
    enabled: false,
  })
}

export const useFetchAthlete = (
  userId: string,
  options?: Partial<UseQueryOptions<UAthlete, Error, UAthlete, [string, string]>>,
) => {
  return useQuery<UAthlete, Error, UAthlete, [string, string]>({
    queryKey: ['athleteId', userId],
    queryFn: () => fetchAthleteByUserId(userId),
    enabled: !!userId,
    ...options,
  })
}

export const useCreateAthlete = (
  userId: string,
  onSuccess?: (response: ApiResponse<UAthlete>) => void,
  onError?: (error: unknown) => void,
) => {
  return useMutation<ApiResponse<UAthlete>, unknown, AthleteFormData>({
    mutationFn: data => createAthlete(data, userId),
    onSuccess,
    onError,
  })
}

export const useUpdateAthlete = (onSuccess?: () => void, onError?: (error: unknown) => void) => {
  return useMutation({
    mutationFn: ({ athleteId, data }: { athleteId: string; data: Partial<UAthlete> }) =>
      updateAthleteData(athleteId, data),
    onSuccess,
    onError,
  })
}
