import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomeView from './components/homeview/index'
import DashboardLayoutAccount from './components/dashboard'
import 'tailwindcss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/dashboard/*" element={<DashboardLayoutAccount />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </QueryClientProvider>
  )
}

export default App
