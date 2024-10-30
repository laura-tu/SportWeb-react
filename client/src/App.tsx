import './index.css'
import React from 'react'
import HomeView from './components/homeview/index.tsx'
import MainDashboard from './components/dashboard/index.tsx'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'

const App: React.FC = () => {

  return (
    <div>
      <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
    </Router>

    </div>
  )
}

export default App
