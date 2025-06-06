import React, { useEffect, useState } from 'react'
import Box from '@/components/box'
import Typography from '@mui/material/Typography'
import { useFetchUserById } from '@/api/hooks/useUserQuery'
import LoadingSpinner from '../loading/loading-spinner'
import { useFetchAthlete } from '@/api/hooks/useAthleteQuery'
import { Badge } from '@/components/ui/badge'
import Heading from '../heading'
import { useTheme } from '@mui/material/styles'
import { cn } from '@/utils/cn'
import { useTestResultsByAthleteId } from '@/api/hooks/useFetchResults'
import type { CSport, CSportTest, UAthlete } from '@/utils/payload/payload-types'
import { useCoachQuery } from '@/api/hooks/useCoachQuery'
import { Venus, Mars, HelpCircle } from 'lucide-react'

interface DemoPageProps {
  userId: string
}

const DemoPageContent: React.FC<DemoPageProps> = ({ userId }) => {
  const { data: userData, isLoading, error } = useFetchUserById(userId)

  const isUser = userData?.roles?.includes('user')
  const isCoachAthlete = userData?.roles?.includes('sportCoach')

  const { data: athleteData, isLoading: isAthleteLoading } = useFetchAthlete(userId, {
    enabled: !!userId && isUser,
  })

  const { data: coach, isLoading: isCoachLoading } = useCoachQuery(userId, {
    enabled: !!userId && isCoachAthlete,
  })

  const {
    data: testResults,
    isLoading: isLoadingResults,
    error: resultsError,
  } = useTestResultsByAthleteId(athleteData?.id, { enabled: !!athleteData?.id })

  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const formatted = now.toLocaleString('sk-SK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setCurrentTime(formatted)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const sports = React.useMemo(() => {
    if (userData?.roles?.includes('user')) {
      return (athleteData?.sport as CSport[]) || []
    }
    if (userData?.roles?.includes('sportCoach')) {
      return (coach?.sport as CSport[]) || []
    }
    return []
  }, [userData, athleteData, coach])

  const testCountsByType = testResults?.docs.reduce(
    (acc, test) => {
      const type = (test.testType as CSportTest)?.name || 'Neznámy typ'
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {String(error)}
      </Typography>
    )
  }

  return (
    <div className="m-5">
      <Box direction="row" className="gap-2 m-2">
        <Box
          direction="col"
          className={cn(
            'border-2 border-gray-400 rounded-3xl h-[25rem] flex-2 items-start p-8 gap-6',
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black',
          )}
        >
          <Typography
            sx={{ color: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
            variant="h4"
          >
            Vitaj späť, <span className="font-bold">{userData?.name}</span>!
          </Typography>
          <Heading
            level={6}
            text="Teší nás, že si opäť tu. Sleduj svoj pokrok, porovnávaj výsledky testov a pracuj na
            svojom výkone krok za krokom."
            className="text-inherit pt-4 w-full"
          />
        </Box>

        <Box direction="col" className="flex-1 h-[25rem] gap-2">
          <Box
            direction="col"
            className={cn(
              'border-2 border-gray-400 rounded-3xl flex-1 justify-center items-center p-2',
              isDarkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-black',
            )}
          >
            <Typography variant="subtitle1" className="text-center text-inherit">
              Aktuálny dátum a čas:
            </Typography>
            <Typography variant="h6" className="text-center text-inherit font-bold!">
              {currentTime}
            </Typography>
          </Box>

          <Box
            direction="col"
            className={cn(
              'border-2 border-gray-400 rounded-3xl flex-1 justify-start items-start p-8',
              isDarkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-black',
            )}
          >
            <Typography variant="subtitle1" className="text-left text-inherit pb-4">
              Toto je zoznam športov, ktorým sa venuješ:
            </Typography>

            {(isUser && isAthleteLoading) || (isCoachAthlete && isCoachLoading) ? (
              <Typography variant="body2" className="text-gray-400">
                Načítavam...
              </Typography>
            ) : sports.length > 0 ? (
              <div className="flex flex-wrap gap-2 ">
                {sports.map((sport, index) => (
                  <Badge
                    key={sport?.id || index}
                    variant="secondary"
                    className="px-6 py-2 rounded-4xl font-bold text-[16px] border-[1px] border-gray-700"
                  >
                    {sport.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <Typography variant="body2" className="text-gray-400">
                Žiadne športy nie sú priradené.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box direction="row" className="gap-2 m-2">
        <Box
          direction="col"
          className={cn(
            'border-2 border-gray-400 rounded-3xl h-[23rem] flex-1 justify-start items-start p-8',
            isDarkMode ? 'bg-[#2a81fa] text-white' : 'bg-[#d4f8ff] text-black',
          )}
        >
          {isCoachAthlete && (
            <>
              <Typography variant="subtitle1" className="text-left text-inherit pb-4">
                Športovci, ktorých trénuješ:
              </Typography>

              {isCoachLoading ? (
                <Typography variant="body2" className="text-gray-400">
                  Načítavam...
                </Typography>
              ) : coach?.athletes && coach.athletes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {coach.athletes
                    .filter((a): a is UAthlete => typeof a !== 'string')
                    .map((athlete, index) => {
                      const genderIcon =
                        athlete.gender === 'zena' ? (
                          <Venus size={12} />
                        ) : athlete.gender === 'muz' ? (
                          <Mars size={12} />
                        ) : (
                          <HelpCircle size={12} />
                        )

                      return (
                        <Badge
                          key={athlete.id || index}
                          variant="secondary"
                          className="flex items-center gap-2 px-6 py-2 rounded-4xl font-bold text-[16px] border-[1px] border-gray-700"
                        >
                          {genderIcon}
                          {athlete.user && typeof athlete.user !== 'string'
                            ? athlete.user.name
                            : (athlete.name ?? 'Nepomenovaný')}
                        </Badge>
                      )
                    })}
                </div>
              ) : (
                <Typography variant="body2" className="text-gray-400">
                  Nemáš priradených žiadnych športovcov.
                </Typography>
              )}
            </>
          )}

          {isUser && (
            <>
              <Typography variant="subtitle1" className="text-left text-inherit pb-4">
                Počet absolvovaných testov podľa typu:
              </Typography>

              {isLoadingResults ? (
                <Typography variant="body2" className="text-gray-400">
                  Načítavam testy...
                </Typography>
              ) : resultsError ? (
                <Typography variant="body2" className="text-red-500">
                  Chyba pri načítaní testov.
                </Typography>
              ) : testCountsByType && Object.keys(testCountsByType).length > 0 ? (
                <div className="flex flex-col gap-3 text-[16px]">
                  {Object.entries(testCountsByType).map(([type, count]) => (
                    <div
                      key={type}
                      className={cn(
                        'px-4 py-2 rounded-full shadow-sm border-[1px] bg-gray-100 text-black',
                        isDarkMode ? 'border-emerald-200' : 'border-blue-800',
                      )}
                    >
                      <span className="font-semibold">{type}</span>: {count}
                    </div>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" className="text-gray-400">
                  Žiadne výsledky testov.
                </Typography>
              )}
            </>
          )}
        </Box>

        <Box
          direction="col"
          className={cn(
            'border-2 border-gray-400 rounded-3xl flex-1 justify-start items-start p-8',
            isDarkMode ? 'bg-[#2a81fa] text-white' : 'bg-[#d4f8ff] text-black',
          )}
        >
          <Typography variant="body2" className="text-inherit"></Typography>
        </Box>
      </Box>
    </div>
  )
}

export default DemoPageContent
