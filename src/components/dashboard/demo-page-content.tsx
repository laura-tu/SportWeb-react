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

interface DemoPageProps {
  userId: string
}

const DemoPageContent: React.FC<DemoPageProps> = ({ userId }) => {
  const { data: userData, isLoading, error } = useFetchUserById(userId)
  const { data: athleteData, isLoading: isAthleteLoading } = useFetchAthlete(userId)

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
            Vitaj späť, {userData?.name}!
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
            <Typography variant="h6" className="text-center text-inherit">
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

            {isAthleteLoading ? (
              <Typography variant="body2" className="text-gray-400">
                Načítavam...
              </Typography>
            ) : athleteData?.sport?.length > 0 ? (
              <div className="flex flex-wrap gap-2 ">
                {athleteData.sport.map((sport: any, index: number) => (
                  <Badge
                    key={index}
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
        <Box direction="col" className="border-2 h-[23rem] flex-1">
          4
        </Box>
        <Box direction="col" className="border-2 h-[23rem] flex-1">
          5
        </Box>
      </Box>
    </div>
  )
}

export default DemoPageContent
