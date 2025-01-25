import './index.css'
import React from 'react'
import HomeView from './components/homeview/index'
import MainDashboard from './components/dashboard/index'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
