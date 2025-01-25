import React from 'react'

import AthleteProfile from './athlete/athlete-profile'
import CoachProfile from './coach/coach-profile'
import { SettingsToggleButtons } from '../dashboard/settings-toggle-buttons'

interface SettingsFormProps {
  session: any
  currentForm: string | null
  setCurrentForm: any
}

const SettingsForm: React.FC<SettingsFormProps> = ({ session, currentForm, setCurrentForm }) => {
  const userRoles = session?.user?.roles || []

  if (userRoles.includes('user') && !userRoles.includes('sportCoach')) {
    return <AthleteProfile userId={session.user.id} />
  }

  if (userRoles.includes('sportCoach') && !userRoles.includes('user')) {
    return <CoachProfile userId={session.user.id} />
  }

  if (userRoles.includes('user') && userRoles.includes('sportCoach')) {
    return (
      <>
        <SettingsToggleButtons session={session} setCurrentForm={setCurrentForm} />
        {currentForm === 'athlete' && <AthleteProfile userId={session.user.id} />}
        {currentForm === 'coach' && <CoachProfile userId={session.user.id} />}
      </>
    )
  }

  return null
}

export default SettingsForm
