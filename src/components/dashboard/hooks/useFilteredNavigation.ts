import { useMemo } from 'react'
import { NAVIGATION_ATHLETE, NAVIGATION_COACH } from '../navigation-config'

export function useFilteredNavigation(session: any) {
  return useMemo(() => {
    if (!session?.user || !Array.isArray(session.user.roles)) {
      return NAVIGATION_ATHLETE // fallback pre neregistrovaného
    }

    const roles = session.user.roles
    if (roles.includes('sportCoach')) return NAVIGATION_COACH
    return NAVIGATION_ATHLETE
  }, [session])
}
