import React, { useState, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AppProvider } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import ThemeToggle from './theme-toggle'
import { Account } from '@toolpad/core/Account'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthSession } from './hooks/useAuthSession'
import SettingsForm from '../settings/index'
import CoachAthletesManager from '../coach-athletes-manager/index'
import LoginForm from '../login-form/index'
import DemoPageContent from './demo-page-content'
import { NAVIGATION } from './navigation-config'
import LoadingOverlay from '../loading/loading-overlay'
import TestResults from '../sport-tests/index'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import WhiteWindow from '../white-window'

const queryClient = new QueryClient()

interface DemoProps {
  window?: () => Window
}

export default function DashboardLayoutAccount(props: DemoProps) {
  const { window } = props
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentForm, setCurrentForm] = useState<'athlete' | 'coach' | null>(null)
  const [showWhiteDashboard, setShowWhiteDashboard] = useState(false)
  const [selectedTestResult, setSelectedTestResult] = useState(null)

  const { session, loading, error, authentication } = useAuthSession()
  const navigate = useNavigate()

  // Always call hooks first, no early returns
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        primary: {
          main: '#3998cc',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: isDarkMode ? '#121212' : '#ffffff',
          paper: isDarkMode ? '#1e1e1e' : '#f5f5f5',
        },
      },
    })
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode)
  }

  const demoWindow = window ? window() : undefined

  const filteredNavigation = useMemo(() => {
    if (!session?.user) {
      // If session is null or user is missing, return a filtered navigation
      return NAVIGATION.filter(
        nav =>
          'segment' in nav &&
          nav.segment !== 'dashboard/athletes' &&
          nav.segment !== 'dashboard/settings',
      )
    }

    const hasSportCoachRole = session?.user?.roles?.includes('sportCoach') //chceck if user exists!!!

    return NAVIGATION.filter(nav => {
      if ('segment' in nav && nav.segment === 'dashboard/athletes' && !hasSportCoachRole) {
        return false // Remove athletes from navigation if user is NOT a sport coach
      }
      return true
    })
  }, [session])

  const handleResultClick = (result: any) => {
    if (!result?.id) {
      console.error('Chýba ID testu!')
      return
    }
    setSelectedTestResult(result)
    setShowWhiteDashboard(true)
    navigate(`/dashboard/test_results/${result.id}`)
  }

  const hasSportCoachRole = session?.user.roles?.includes('sportCoach')

  // Handle loading state
  if (loading) {
    return (
      <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 4 }}>
        Načítavam...
        <LoadingOverlay />
      </Typography>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 4, color: 'red' }}>
        {error}
      </Typography>
    )
  }

  if (!session?.user) {
    return (
      <div>
        <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 4 }}>
          Nie ste prihlásený
        </Typography>
        <LoginForm onClose={() => console.log('Zatvor prihlasovací formulár')} />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppProvider
          session={session}
          authentication={authentication}
          navigation={filteredNavigation}
          theme={theme}
          window={demoWindow}
          branding={{
            logo: <img src="/logo_black_50.jpg" alt="SportWeb logo" />,
            title: 'SportWeb',
          }}
          // colorScheme={{ primary: '#3998cc', secondary: '#f50057', complementary: '#0a2396' }}
        >
          <DashboardLayout
            slots={{
              toolbarAccount: () => (
                <Account
                  localeText={{
                    signInLabel: 'Prihlásiť sa',
                    signOutLabel: 'Odhlásiť sa',
                  }}
                />
              ),
            }}
          >
            <Routes>
              <Route path="/" element={<DemoPageContent />} />
              <Route
                path="settings"
                element={
                  <div>
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
                }
              />
              {hasSportCoachRole && (
                <Route
                  path="athletes"
                  element={
                    <div>
                      <Box sx={{ pt: 3, ml: 3 }}>
                        <Typography variant="h4" gutterBottom>
                          Športovci
                        </Typography>
                      </Box>
                      <CoachAthletesManager userId={session.user.id} />
                    </div>
                  }
                />
              )}
              <Route
                path="test_results/inbody_results"
                element={
                  hasSportCoachRole ? (
                    <DemoPageContent />
                  ) : session?.user ? (
                    <div>
                      <Box sx={{ pt: 3, ml: 3 }}>
                        <Typography variant="h4" gutterBottom>
                          Výsledky testov z Inbody merania
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TestResults
                            session={session}
                            onResultClick={handleResultClick}
                            testType={'INBODY'}
                          />
                        </LocalizationProvider>
                      </Box>
                    </div>
                  ) : (
                    <Typography variant="h5" color="error">
                      Používateľ nie je prihlásený
                    </Typography>
                  )
                }
              />

              <Route
                path="test_results/spiroergometry"
                element={
                  hasSportCoachRole ? (
                    <DemoPageContent />
                  ) : session?.user ? (
                    <div>
                      <Box sx={{ pt: 3, ml: 3 }}>
                        <Typography variant="h4" gutterBottom>
                          Výsledky testov zo spiroergometrie
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TestResults
                            session={session}
                            onResultClick={handleResultClick}
                            testType={'Pnoe'}
                          />
                        </LocalizationProvider>
                      </Box>
                    </div>
                  ) : (
                    <Typography variant="h5" color="error">
                      Používateľ nie je prihlásený
                    </Typography>
                  )
                }
              />
              <Route
                path="test_results/:resultId"
                element={<WhiteWindow result={selectedTestResult} />}
              />

              <Route path="*" element={<DemoPageContent />} />
            </Routes>

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
