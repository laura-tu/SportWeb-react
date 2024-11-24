import React, { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { useDemoRouter } from '@toolpad/core/internal'
import ThemeToggle from './theme-toggle.tsx'
import { Account } from '@toolpad/core/Account'
import SettingsAthlete from '../settings/athlete-profile.tsx'
import SettingsCoach from '../settings/coach-profile.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthSession } from './hooks/useAuthSession.tsx'
import { SettingsToggleButtons } from './settings-toggle-buttons.tsx'

const queryClient = new QueryClient()
const NAVIGATION: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
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
        },
      }),
    [isDarkMode],
  )

  const router = useDemoRouter('/dashboard')
  const demoWindow = window ? window() : undefined

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider
          session={session}
          authentication={authentication}
          navigation={NAVIGATION}
          router={router}
          theme={theme}
          window={demoWindow}
          branding={{
            logo: <img src="./logo_black_50.jpg" alt="SportWeb logo" />,
            title: 'SportWeb',
          }}
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
            {router.pathname === '/settings' && session?.user ? (
              <>
                <Box sx={{ m: 3 }}>
                  <Typography variant="h4" gutterBottom>
                    Profil
                  </Typography>
                  <Typography variant="body1">Aktualizuj svoje informácie tu.</Typography>
                </Box>

                {/* Directly display the appropriate form based on user role */}
                {session?.user?.roles?.includes('user') &&
                  !session?.user?.roles?.includes('sportCoach') && (
                    <SettingsAthlete userId={session.user.id} />
                  )}
                {session?.user?.roles?.includes('sportCoach') &&
                  !session?.user?.roles?.includes('user') && (
                    <SettingsCoach userId={session.user.id} />
                  )}

                {/* Render the buttons to toggle between forms when user has both roles */}
                {session?.user && (
                  <SettingsToggleButtons session={session} setCurrentForm={setCurrentForm} />
                )}

                {/* If currentForm is set, display the corresponding form */}
                {currentForm === 'athlete' && session?.user?.roles?.includes('user') && (
                  <SettingsAthlete userId={session.user.id} />
                )}
                {currentForm === 'coach' && session?.user?.roles?.includes('sportCoach') && (
                  <SettingsCoach userId={session.user.id} />
                )}
              </>
            ) : (
              <DemoPageContent pathname={router.pathname} />
            )}

            {/* Show user name */}
            {router.pathname === '/' && session && session.user && (
              <Box sx={{ pl: 3, textAlign: 'start' }}>
                <Typography variant="h6">Vitaj, {session.user.name}</Typography>
              </Box>
            )}

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
