import { useState, useEffect, useMemo } from 'react'
import { fetchUserData, useAuth } from '../../../services/user.ts'
import { Session as ToolpadSession } from '@toolpad/core/AppProvider'
import { User } from '../../../utils/interfaces.ts'
import { loginUser } from '../../../services/user.ts'
import axios from 'axios'

interface Session extends ToolpadSession {
  user: User
}

export const useAuthSession = () => {
  const { signOut, signIn } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const user = await fetchUserData()
        setSession({ user })
        setError(null)
      } catch (error) {
        console.error('Nepodarilo sa načítať údaje o používateľovi:', error)
        setError('Nepodarilo sa načítať údaje o používateľovi')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  let credentials: { email: string; password: string } | null = null

  const authentication = useMemo(
    () => ({
      signIn: () => {
        if (!credentials) {
          signIn() //redirected to /dashboard and loginForm
          //console.error('No credentials provided for sign-in')
          return
        }

        /*loginUser(credentials)
          .then(data => {
            if (data.token && data.user) {
              localStorage.setItem('token', data.token)
              axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
              setSession({ user: data.user })
            } else {
              console.error('Prihlásenie zlyhalo: Neplatný token alebo používateľské dáta')
            }
          })
          .catch(error => {
            console.error('Chyba počas prihlasovania:', error)
          })*/
      },
      signOut: () => {
        signOut()
        setSession(null)
      },
    }),
    [session],
  )

  return {
    session,
    authentication,
    setLoginCredentials: (email: string, password: string) => {
      credentials = { email, password }
    },
    loading,
    error,
  }
}
