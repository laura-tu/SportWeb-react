import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  AppProvider,
  type NavigationItem,
  type NavigationSubheaderItem,
} from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { useDemoRouter } from '@toolpad/core/internal'
import ThemeToggle from './theme-toggle.tsx'
import { Account } from '@toolpad/core/Account'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthSession } from './hooks/useAuthSession.tsx'
import SettingsForm from '../settings/index.tsx'
import CoachAthletesManager from '../coach-athletes-manager/index.tsx'
import LoginForm from '../login-form/index.tsx'

const queryClient = new QueryClient()
type Navigation = (NavigationItem | NavigationSubheaderItem)[]
const NAVIGATION: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'athletes',
    title: 'Športovci',
    icon: <PersonPinOutlinedIcon />,
  },
  {
    segment: 'settings',
    title: 'Nastavenie profilu',
    icon: <SettingsAccessibilityIcon />,
  },
]

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  )
}

interface DemoProps {
  window?: () => Window
}

export default function DashboardLayoutAccount(props: DemoProps) {
  const { window } = props

  const { session, authentication } = useAuthSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentForm, setCurrentForm] = useState<'athlete' | 'coach' | null>(null)

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#3998cc', // Replace with your primary color
          },
          secondary: {
            main: '#f50057', // Replace with your secondary color
          },
          background: {
            default: isDarkMode ? '#121212' : '#ffffff', // Default background
            paper: isDarkMode ? '#1e1e1e' : '#f5f5f5', // Paper background
          },
        },
      }),
    [isDarkMode],
  )

  const router = useDemoRouter('/dashboard')
  const demoWindow = window ? window() : undefined

  const filteredNavigation = useMemo(() => {
    if (!session?.user) {
      return NAVIGATION.filter(
        nav => 'segment' in nav && nav.segment !== 'athletes' && nav.segment !== 'settings',
      )
    }

    const hasSportCoachRole = session.user.roles?.includes('sportCoach')

    return NAVIGATION.filter(nav => {
      // Only filter out the 'athletes' segment if the user lacks the 'sportCoach' role
      if ('segment' in nav && nav.segment === 'athletes' && !hasSportCoachRole) {
        return false
      }
      return true
    })
  }, [session])

  const renderPageContent = () => {
    /* if (!session?.user) {
      return <DemoPageContent pathname={router.pathname} />
    }*/
    if (!session?.user) {
      return (
        <div>
          <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 4 }}>
            Nie ste prihlásený
          </Typography>
          {/* Pass the handleLogin function to the LoginForm */}
          <LoginForm
            // onSubmit={(email, password) => handleLogin(email, password)}
            onClose={() => console.log('Zatvor prihlasovací formulár')}
          />
        </div>
      )
    }

    const hasSportCoachRole = session.user.roles?.includes('sportCoach')

    switch (router.pathname) {
      case '/settings':
        return (
          <div className="">
            <Box sx={{ pt: 3, px: 3, ml: 3 }}>
              <Typography variant="h4" gutterBottom>
                Profil
              </Typography>
            </Box>
            <SettingsForm
              session={session}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />
          </div>
        )

      case '/athletes':
        if (!hasSportCoachRole) {
          return <DemoPageContent pathname={router.pathname} />
        }
        return (
          <div>
            <Box sx={{ pt: 3, ml: 3 }}>
              <Typography variant="h4" gutterBottom>
                Športovci
              </Typography>
            </Box>
            <CoachAthletesManager userId={session.user.id} />
          </div>
        )

      default:
        return <DemoPageContent pathname={router.pathname} />
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider
          session={session}
          authentication={authentication}
          navigation={filteredNavigation}
          router={router}
          theme={theme}
          window={demoWindow}
          branding={{
            logo: <img src="./logo_black_50.jpg" alt="SportWeb logo" />,
            title: 'SportWeb',
          }}
          colorScheme={{ primary: '#3998cc', secondary: '#f50057', complementary: '#0a2396' }}
        >
          <DashboardLayout
            slots={{
              toolbarAccount: () => (
                <Account
                  localeText={{
                    signInLabel: 'Prihlásiť sa',
                    signOutLabel: 'Odhlásiť sa',
                  }}
                  sx={{ bgColor: '#0492c2' }}
                />
              ),
            }}
          >
            {renderPageContent()}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'start',
                padding: 2,
                position: 'fixed',
                bottom: 0,
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </Box>
          </DashboardLayout>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
