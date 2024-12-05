import React from 'react'

import SettingsAthlete from '../settings/athlete/settings-athlete.tsx'
import SettingsCoach from '../settings/coach/settings-coach.tsx'
import { SettingsToggleButtons } from '../dashboard/settings-toggle-buttons.tsx'

interface SettingsFormProps {
  session: any
  currentForm: string | null
  setCurrentForm: any
}

const SettingsForm: React.FC<SettingsFormProps> = ({ session, currentForm, setCurrentForm }) => {
  const userRoles = session?.user?.roles || []

  if (userRoles.includes('user') && !userRoles.includes('sportCoach')) {
    return <SettingsAthlete userId={session.user.id} />
  }

  if (userRoles.includes('sportCoach') && !userRoles.includes('user')) {
    return <SettingsCoach userId={session.user.id} />
  }

  if (userRoles.includes('user') && userRoles.includes('sportCoach')) {
    return (
      <>
        <SettingsToggleButtons session={session} setCurrentForm={setCurrentForm} />
        {currentForm === 'athlete' && <SettingsAthlete userId={session.user.id} />}
        {currentForm === 'coach' && <SettingsCoach userId={session.user.id} />}
      </>
    )
  }

  return null
}

export default SettingsForm
