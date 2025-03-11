import React, { useEffect } from 'react'
import AthleteProfile from './athlete/athlete-profile'
import CoachProfile from './coach/coach-profile'
import SidebarNavigation from './components/sidebar-navigation'
import AccountSettings from './components/account-settings'

interface SettingsFormProps {
  session: any
  currentForm: string | null
  setCurrentForm: any
}

const SettingsLayout: React.FC<SettingsFormProps> = ({ session, currentForm, setCurrentForm }) => {
  const userRoles = session?.user?.roles || []

  useEffect(() => {
    if (userRoles.includes('user') && !userRoles.includes('sportCoach') && !currentForm) {
      setCurrentForm('athlete')
    }
    if (!userRoles.includes('user') && userRoles.includes('sportCoach') && !currentForm) {
      setCurrentForm('coach')
    }
  }, [userRoles, currentForm, setCurrentForm])

  const renderContent = () => {
    if (currentForm === 'athlete') {
      return <AthleteProfile userId={session.user.id} />
    } else if (currentForm === 'password') {
      return <AccountSettings userId={session.user.id} />
    } else if (currentForm === 'coach') {
      return <CoachProfile userId={session.user.id} />
    }
    return null
  }

  if (userRoles.includes('user') || userRoles.includes('sportCoach')) {
    return <SidebarNavigation> {renderContent()}</SidebarNavigation>
  }

  return null
}

export default SettingsLayout
