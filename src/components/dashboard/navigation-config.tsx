import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility'
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import { type NavigationItem, type NavigationSubheaderItem } from '@toolpad/core/AppProvider'

type Navigation = (NavigationItem | NavigationSubheaderItem)[]

export const NAVIGATION_COACH: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dashboard/settings',
    title: 'Nastavenie profilu',
    icon: <SettingsAccessibilityIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Výsledky zverencov',
  },
  {
    segment: 'dashboard/athletes',
    title: 'Športovci',
    icon: <PersonPinOutlinedIcon />,
  },
]

export const NAVIGATION_ATHLETE: Navigation = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dashboard/settings',
    title: 'Nastavenie profilu',
    icon: <SettingsAccessibilityIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analýza',
  },
  {
    segment: 'dashboard/test_results',
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
]
