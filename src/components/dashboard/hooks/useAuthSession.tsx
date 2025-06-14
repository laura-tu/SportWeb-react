import { useState, useMemo } from 'react'
import { useAuth } from '../../../services/user'
import { Session as ToolpadSession } from '@toolpad/core/AppProvider'
import { User } from '@/utils/payload/payload-types'
import { useCurrentUser } from '@/api/hooks/useUserQuery'
import { useQueryClient } from '@tanstack/react-query'

interface Session extends ToolpadSession {
  user: User
}

export const useAuthSession = () => {
  const queryClient = useQueryClient()
  const { signOut, signIn } = useAuth()
  const { data: user, isLoading: loading, error } = useCurrentUser()

  const [credentials, setCredentials] = useState<{
    email: string
    password: string
    image?: string
  } | null>(null)

  const session: Session | null = user ? { user } : null

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
    setLoginCredentials: (email: string, password: string, image?: string) => {
      setCredentials({ email, password, image })
    },
    loading,
    error: error ? 'Nepodarilo sa načítať údaje o používateľovi' : null,
  }
}
