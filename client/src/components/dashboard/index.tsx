import React from 'react'
import { useState, useMemo, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AppProvider, type Session, type Navigation } from '@toolpad/core/AppProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { useDemoRouter } from '@toolpad/core/internal'
import ThemeToggle from './theme-toggle.tsx'
import { fetchUserData } from '../../services/user.ts'

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
      {/*prec*/}
    </Box>
  )
}

interface DemoProps {
  window?: () => Window
}

export default function DashboardLayoutAccount(props: DemoProps) {
  const { window } = props

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

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

  const fetchData = async () => {
    try {
      const user = await fetchUserData()
      setSession({ user })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const router = useDemoRouter('/dashboard')
  const demoWindow = window ? window() : undefined

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        session={session}
        navigation={NAVIGATION}
        router={router}
        theme={theme}
        window={demoWindow}
        branding={{
          logo: <img src="./logo_black_50.jpg" alt="SportWeb logo" />,
          title: 'SportWeb',
        }}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
          {session && session.user && (
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
  )
}
