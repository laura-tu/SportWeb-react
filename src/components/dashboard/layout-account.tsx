import React from 'react'
import { DemoProps } from '.'
import { useAuthSession } from './hooks/useAuthSession'
import LoadingSpinner from '../loading/loading-spinner'
import { ErrorMessage } from '../error-message'
import { UnauthenticatedScreen } from '../unauthenticated-screen'
import { AppWithLayout } from './app-with-layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function DashboardLayoutAccount(props: DemoProps) {
  const { window } = props
  const { session, loading, error, authentication } = useAuthSession()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!session?.user) return <UnauthenticatedScreen />

  return (
    <QueryClientProvider client={queryClient}>
      <AppWithLayout session={session} authentication={authentication} window={window} />
    </QueryClientProvider>
  )
}
