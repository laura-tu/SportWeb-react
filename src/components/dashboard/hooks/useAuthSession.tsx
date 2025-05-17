import { useState, useMemo } from 'react'
import { useAuth } from '../../../services/user'
import { Session as ToolpadSession } from '@toolpad/core/AppProvider'
import { User } from '../../../utils/interfaces'
import { useCurrentUser } from '@/api/hooks/useCurrentUser'
import { useQueryClient } from '@tanstack/react-query'

interface Session extends ToolpadSession {
  user: User
}

export const useAuthSession = () => {
  const queryClient = useQueryClient()
  const { signOut, signIn } = useAuth()
  const { data: user, isLoading: loading, error } = useCurrentUser()
  console.log('user', user)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)

  const session: Session | null = user ? { user } : null
  console.log('session', session)

  const authentication = useMemo(
    () => ({
      signIn: () => {
        if (!credentials) {
          signIn() //redirected to /dashboard and loginForm
          return
        }
      },
      signOut: () => {
        signOut()
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      },
    }),
    [credentials],
  )

  return {
    session,
    authentication,
    setLoginCredentials: (email: string, password: string) => {
      setCredentials({ email, password })
    },
    loading,
    error: error ? 'Nepodarilo sa načítať údaje o používateľovi' : null,
  }
}
