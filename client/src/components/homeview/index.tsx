import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeaderComp from '../header/index.tsx'
import RegistrationForm from '../registration-form/index.tsx'
import AthleteReg from '../athlete-reg/index.tsx'
import CoachReg from '../coach-reg/index.tsx'
import LoginForm from '../login-form/index.tsx'

const HomeView = () => {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showAthleteReg, setShowAthleteReg] = useState(false)
  const [showCoachReg, setShowCoachReg] = useState(false)
  const [userId, setUserId] = useState(null)

  const location = useLocation()
  const isDashboardRoute = location.pathname === '/dashboard'

  const toggleRegistration = () => setShowRegistration(!showRegistration)
  const toggleLogin = () => setShowLogin(!showLogin)

  const showNextComponent = (id, user) => {
    setUserId(id)

    if (user.role === 'user') {
      setShowRegistration(false)
      setShowAthleteReg(true)
    } else if (user.role === 'coach') {
      setShowRegistration(false)
      setShowCoachReg(true)
    }
  }

  const closeRegistration = () => setShowRegistration(false)
  const closeLogin = () => setShowLogin(false)
  const closeAthleteReg = () => setShowAthleteReg(false)
  const closeCoachReg = () => setShowCoachReg(false)

  return (
    <div>
      {!isDashboardRoute && (
        <HeaderComp onShowRegistration={toggleRegistration} onShowLogin={toggleLogin} />
      )}

      {showRegistration && (
        <RegistrationForm onClose={closeRegistration} onNext={showNextComponent} />
      )}
      {showAthleteReg && <AthleteReg onClose={closeAthleteReg} userId={userId} />}
      {showCoachReg && <CoachReg onClose={closeCoachReg} userId={userId} />}
      {showLogin && !isDashboardRoute && <LoginForm onClose={closeLogin} />}
    </div>
  )
}

export default HomeView
