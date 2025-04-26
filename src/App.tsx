import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomeView from './components/homeview/index'
import DashboardLayoutAccount from './components/dashboard'
import 'tailwindcss'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/dashboard/*" element={<DashboardLayoutAccount />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
