import React, { useEffect } from 'react'
import AthleteProfile from './athlete/athlete-profile'
import CoachProfile from './coach/coach-profile'
import { SettingsToggleButtons } from '../dashboard/settings-toggle-buttons'
import { Typography } from '@mui/material'
import Settings from './data/settings'

interface SettingsFormProps {
  session: any
  currentForm: string | null
  setCurrentForm: any
}

const SettingsForm: React.FC<SettingsFormProps> = ({ session, currentForm, setCurrentForm }) => {
  const userRoles = session?.user?.roles || []

  useEffect(() => {
    if (userRoles.includes('user') && !userRoles.includes('sportCoach') && !currentForm) {
      setCurrentForm('athlete')
    }
  }, [userRoles, currentForm, setCurrentForm])

  const renderContent = () => {
    if (currentForm === 'athlete') {
      return <AthleteProfile userId={session.user.id} />
    } else if (currentForm === 'password') {
      return <Settings userId={session.user.id} />
    } else if (currentForm === 'coach') {
      return <CoachProfile userId={session.user.id} />
    }
    return null
  }

  if (userRoles.includes('user') && !userRoles.includes('sportCoach')) {
    return (
      <div className="mx-6 flex h-[80vh] border-[1px]">
        <div className="flex flex-col gap-4 bg-blue-400 w-[15rem] max-h-fit-content pt-6 border-r-[1px]">
          <button
            className="p-2 underline hover:cursor-pointer"
            onClick={() => setCurrentForm('athlete')}
          >
            <Typography variant="button">Môj profil</Typography>
          </button>
          <button
            className="p-2 underline hover:cursor-pointer"
            onClick={() => setCurrentForm('password')}
          >
            <Typography variant="button"> Môj účet</Typography>
          </button>
        </div>

        {renderContent()}
      </div>
    )
  }

  if (userRoles.includes('sportCoach') && !userRoles.includes('user')) {
    return (
      <div className="mx-6 flex h-[80vh] border-[1px]">
        <div className="flex flex-col gap-4 bg-blue-400 w-[15rem] max-h-fit-content pt-6 border-r-[1px]">
          <button
            className="p-2 underline hover:cursor-pointer"
            onClick={() => setCurrentForm('athlete')}
          >
            <Typography variant="button">Môj profil</Typography>
          </button>
          <button
            className="p-2 underline hover:cursor-pointer"
            onClick={() => setCurrentForm('password')}
          >
            <Typography variant="button"> Môj účet</Typography>
          </button>
        </div>
        <CoachProfile userId={session.user.id} />
        <Settings userId={session.user.id} />
      </div>
    )
  }

  if (userRoles.includes('user') && userRoles.includes('sportCoach')) {
    return (
      <div className="m-6">
        <SettingsToggleButtons session={session} setCurrentForm={setCurrentForm} />
        {currentForm === 'athlete' && <AthleteProfile userId={session.user.id} />}
        {currentForm === 'coach' && <CoachProfile userId={session.user.id} />}
      </div>
    )
  }

  return null
}

export default SettingsForm
