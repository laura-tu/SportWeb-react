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
  const userRoles = session.user.roles || []
  const isCoach = userRoles.includes('sportCoach')

  const renderContent = () => {
    switch (currentForm) {
      case 'athlete':
        return <AthleteProfile userId={session.user.id} />
      case 'coach':
        return <CoachProfile userId={session.user.id} />
      case 'password':
        return <AccountSettings userId={session.user.id} />
      default:
        return null
    }
  }

  return (
    <SidebarNavigation setCurrentForm={setCurrentForm} userRole={isCoach ? 'coach' : 'athlete'}>
      {renderContent()}
    </SidebarNavigation>
  )
}

export default SettingsLayout
