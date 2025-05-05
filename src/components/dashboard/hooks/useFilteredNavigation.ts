import { useMemo } from 'react'
import { NAVIGATION } from '../navigation-config'

type NavItem = (typeof NAVIGATION)[number]

function hasSegment(item: NavItem): item is NavItem & { segment: string } {
  return typeof (item as any).segment === 'string'
}

export function useFilteredNavigation(session: any) {
  return useMemo(() => {
    if (!session?.user) {
      return NAVIGATION.filter(
        (item): item is NavItem & { segment: string } =>
          hasSegment(item) && !['dashboard/athletes', 'dashboard/settings'].includes(item.segment),
      )
    }

    const isCoach = session.user.roles.includes('sportCoach')

    return NAVIGATION.filter(item => {
      if (hasSegment(item)) {
        return !(item.segment === 'dashboard/athletes' && !isCoach)
      }
      return true // keep headers/dividers/groups
    })
  }, [session])
}
