import React from 'react'
import { AppProvider } from '@toolpad/core/AppProvider'
import { Toaster } from 'sonner'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { Account } from '@toolpad/core/Account'
import { DashboardRoutes } from './dashboard-routes'
import { CustomThemeSwitcher } from './theme-switcher'
import { demoTheme } from './theme-switcher'
import { useFilteredNavigation } from './hooks/useFilteredNavigation'

export function AppWithLayout({ session, authentication, window }) {
  const filteredNavigation = useFilteredNavigation(session)
  const demoWindow = window ? window() : undefined

  return (
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
                accountSignInLabel: 'Prihlásiť sa',
                accountSignOutLabel: 'Odhlásiť sa',
              }}
            />
          ),
          toolbarActions: CustomThemeSwitcher,
        }}
      >
        <DashboardRoutes session={session} />
      </DashboardLayout>
    </AppProvider>
  )
}
