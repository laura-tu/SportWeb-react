import { useQuery } from '@tanstack/react-query'
import {  CoachIdResponse } from '../../../services/coach'

/*const useFetchCoach = (athleteId?: string) => {
  const { data, isLoading, error } = useQuery<CoachIdResponse>({
    queryKey: ['coach', athleteId], // Use athlete.id as the query key
    queryFn: () => {
      if (athleteId) {
        return fetchCoachByAthleteId(athleteId) // Fetch coach using athlete ID
      }
      return Promise.reject('Nie je dostupné žiadne ID športovca')
    },
    enabled: !!athleteId, // Only run the query when athlete ID exists
  })

  const coach = data?.docs[0]
  return { coach, isFetchingCoach: isLoading, coachError: error }
}

export default useFetchCoach*/
