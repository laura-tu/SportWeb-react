import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined'
import { type NavigationItem, type NavigationSubheaderItem } from '@toolpad/core/AppProvider'

type Navigation = (NavigationItem | NavigationSubheaderItem)[]

export const NAVIGATION: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'athletes',
    title: 'Športovci',
    icon: <PersonPinOutlinedIcon />,
  },
  {
    segment: 'settings',
    title: 'Nastavenie profilu',
    icon: <SettingsAccessibilityIcon />,
  },
  {
    segment: 'test_results',
    title: 'Výsledky testov',
    icon: <AnalyticsIcon />,
    children: [
      {
        kind: 'page',
        segment: 'inbody_results',
        title: 'Inbody meranie',
        icon: <PersonSearchIcon />,
      },
      {
        kind: 'page',
        segment: 'spiroergometry',
        title: 'Spiroergometria',
        icon: <MonitorHeartIcon />,
      },
    ],
  },
  {
    segment: 'competitions',
    title: 'Súťaže',
    icon: <ScoreboardOutlinedIcon />,
  },
]
