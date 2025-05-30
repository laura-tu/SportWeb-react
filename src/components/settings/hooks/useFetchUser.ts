import { useQuery } from '@tanstack/react-query'
import { fetchUserData } from '@/api/user'
import { useRef } from 'react'

const useFetchUser = () => {
  const originalDataRef = useRef<any>(null)

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
  })

  if (userData && !originalDataRef.current) {
    originalDataRef.current = userData
  }

  return { user: userData, isFetchingUser: isLoading, userError: error, originalDataRef }
}

export default useFetchUser
