import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import HeaderComp from '../header/index'
import RegistrationForm from '../registration/registration-form/index'
import AthleteRegistration from '../registration/athlete-registration/index'
import CoachRegistration from '../registration/coach-registration/index'
import LoginForm from '../login-form/index'

export enum UserRole {
  USER = 'user',
  COACH = 'sportCoach',
  ADMIN = 'admin',
}
const HomeView = () => {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [showAthleteReg, setShowAthleteReg] = useState(false)
  const [showCoachReg, setShowCoachReg] = useState(false)
  const [userId, setUserId] = useState(null)

  const location = useLocation()
  const isDashboardRoute = location.pathname === '/dashboard'

  const toggleRegistration = () => setShowRegistration(!showRegistration)
  const toggleLogin = () => setShowLogin(!showLogin)

  const showNextComponent = (id, user) => {
    setUserId(id)

    if (user.role === UserRole.USER) {
      setShowRegistration(false)
      setShowAthleteReg(true)
    } else if (user.role === UserRole.COACH) {
      setShowRegistration(false)
      setShowCoachReg(true)
    }
  }

  const closeRegistration = () => setShowRegistration(false)
  const closeLogin = () => setShowLogin(false)
  const closeAthleteReg = () => {
    setShowAthleteReg(false)
    setUserId(null)
  }

  const closeCoachReg = () => {
    setShowCoachReg(false)
    setUserId(null)
  }

  return (
    <div className="bg-gradient-to-br from-cyan-200 via-blue-400 to-red-400 w-full h-screen">
      {!isDashboardRoute && (
        <HeaderComp onShowRegistration={toggleRegistration} onShowLogin={toggleLogin} />
      )}

      {showRegistration && (
        <RegistrationForm onClose={closeRegistration} onNext={showNextComponent} />
      )}
      {showAthleteReg && <AthleteRegistration onClose={closeAthleteReg} userId={userId} />}
      {showCoachReg && <CoachRegistration onClose={closeCoachReg} userId={userId} />}
      {showLogin && !isDashboardRoute && <LoginForm onClose={closeLogin} />}
    </div>
  )
}

export default HomeView
