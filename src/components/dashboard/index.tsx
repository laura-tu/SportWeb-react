import React, { useState, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { AppProvider } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { Account } from '@toolpad/core/Account'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthSession } from './hooks/useAuthSession'
import SettingsLayout from '../settings/settings-layout'
import LoginForm from '../login-form/index'
import DemoPageContent from './demo-page-content'
import { NAVIGATION } from './navigation-config'
import LoadingSpinner from '../loading/loading-spinner'
import TestResultsList from '../tests-list/index'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import TestDetailWindow from '../test-detail'
import { CustomThemeSwitcher, demoTheme } from './theme-switcher'
import SpiroergometryDetail from '../pnoe-detail'
import { Toaster } from 'sonner'
import Heading from '../heading'

const queryClient = new QueryClient()

interface DemoProps {
  window?: () => Window
}

export default function DashboardLayoutAccount(props: DemoProps) {
  const { window } = props
  const [currentForm, setCurrentForm] = useState<'athlete' | 'coach' | 'password' | null>(null)

  const [selectedTestResult, setSelectedTestResult] = useState(null)

  const { session, loading, error, authentication } = useAuthSession()
  const navigate = useNavigate()

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

    if (result.testType?.name === 'INBODY') {
      navigate(`/dashboard/test_results/inbody_results/${result.id}`)

    } else if (result.testType?.name === 'Pnoe') {
      navigate(`/dashboard/test_results/spiroergometry/${result.id}`)
      
    }
  }

  const hasSportCoachRole = session?.user.roles?.includes('sportCoach')

  if (loading) {
    return <LoadingSpinner />
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
      <AppProvider
        session={session}
        authentication={authentication}
        navigation={filteredNavigation}
        theme={demoTheme}
        window={demoWindow}
        branding={{
          logo: <img src="/logo_black_50.jpg" alt="SportWeb logo" />,
          title: 'SportWeb',
        }}
      >
        <Toaster />
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
            toolbarActions: CustomThemeSwitcher,
          }}
        >
          <Routes>
            <Route path="/" element={<DemoPageContent userId={session.user.id} />} />
            <Route
              path="settings"
              element={
                <div>
                  <div className="pt-3 px-3 ml-3">
                    <Heading level={4} text="Profil" />
                  </div>
                  <SettingsLayout
                    session={session}
                    currentForm={currentForm}
                    setCurrentForm={setCurrentForm}
                  />
                </div>
              }
            />

            <Route
              path="test_results/inbody_results"
              element={
                hasSportCoachRole ? (
                  <DemoPageContent userId={session.user.id} />
                ) : session?.user ? (
                  <div>
                    <div className="pt-3 ml-3">
                      <Heading level={4} text="Výsledky testov z Inbody merania" />
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TestResultsList
                          userId={session.user.id}
                          onResultClick={handleResultClick}
                          testType={'INBODY'}
                        />
                      </LocalizationProvider>
                    </div>
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
                  <DemoPageContent userId={session.user.id} />
                ) : session?.user ? (
                  <div>
                    <div className="pt-3 ml-3">
                      <Heading level={4} text="
                        Výsledky testov zo spiroergometrie"/>
                      
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TestResultsList
                          userId={session.user.id}
                          onResultClick={handleResultClick}
                          testType={'Pnoe'}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                ) : (
                  <Typography variant="h5" color="error">
                    Používateľ nie je prihlásený
                  </Typography>
                )
              }
            />
            <Route
              path="test_results/inbody_results/:resultId"
              element={<TestDetailWindow result={selectedTestResult} />}
            />

            <Route
              path="test_results/spiroergometry/:resultId"
              element={<SpiroergometryDetail result={selectedTestResult} />}
            />

            <Route path="*" element={<DemoPageContent userId={session.user.id} />} />
          </Routes>
        </DashboardLayout>
      </AppProvider>
    </QueryClientProvider>
  )
}
