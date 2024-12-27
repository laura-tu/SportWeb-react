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
  const { signOut } = useAuth()
  const [session, setSession] = useState<Session | null>(null) //session object holds the authenticated user's data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchUserData()
        setSession({ user })
      } catch (error) {
        console.error('Nepodarilo sa načítať údaje o používateľovi:', error)
      }
    }
    fetchData()
  }, [])

  // Temporary credentials storage
  let credentials: { email: string; password: string } | null = null

  const authentication = useMemo(
    () => ({
      /*signIn: () => {
        if (!session?.user) {
          console.error('No user data available for sign-in')
          return
        }
        setSession({ user: session.user })
      },*/
      signIn: () => {
        if (!credentials) {
          console.error('No credentials provided for sign-in')
          return
        }

        // Perform login with stored credentials
        loginUser(credentials)
          .then(data => {
            if (data.token && data.user) {
              // Save token and set headers
              localStorage.setItem('token', data.token)
              axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

              // Update session with user data
              setSession({ user: data.user })
            } else {
              console.error('Prihlásenie zlyhalo: Neplatný token alebo používateľské dáta')
            }
          })
          .catch(error => {
            console.error('Chyba počas prihlasovania:', error)
          })
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
  }
}
