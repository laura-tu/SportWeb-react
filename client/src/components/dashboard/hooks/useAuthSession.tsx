import { useState, useEffect, useMemo } from 'react'
import { fetchUserData, useAuth } from '../../../services/user.ts'
import { Session as ToolpadSession } from '@toolpad/core/AppProvider'
import { User } from '../../../utils/interfaces.ts'

interface Session extends ToolpadSession {
  user: User
}

export const useAuthSession = () => {
  const { signOut } = useAuth()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserData()
        setSession({ user })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
    fetchData()
  }, [])

  const authentication = useMemo(
    () => ({
      signIn: () => {
        if (!session?.user) {
          console.error('No user data available for sign-in')
          return
        }
        setSession({ user: session.user })
      },
      signOut: () => {
        signOut()
        setSession(null)
      },
    }),
    [session],
  )

  return { session, authentication }
}
