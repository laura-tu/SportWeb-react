import React, { useState } from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import LoadingSpinner from '../loading/loading-spinner'
import useFetchAthlete from '../settings/hooks/useFetchAthlete'
import useFetchTestResults from './hooks/useFetchTestResults'
import DateFilter from './date-filter/index'
import useFetchUserById from '../../utils/api/useFetchUserById'
import Box from '@/components/box'

interface SportTestsProps {
  userId: string
  onResultClick: (result: any) => void
  testType: string
}

const TestResultsList: React.FC<SportTestsProps> = ({ userId, onResultClick, testType }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { testResults, isFetchingTestResults, testResultsError } = useFetchTestResults(
    testType,
    athlete?.id,
  )

  const { data: userData, isLoading, error } = useFetchUserById(userId)

  if (isLoading || isFetchingTestResults || isFetchingAthleteId) {
    return <LoadingSpinner />
  }

  if (error || testResultsError || athleteError) {
    return (
      <Typography variant="h6" color="error">
        {String(error || testResultsError || athleteError)}
      </Typography>
    )
  }

  const docs = testResults || []
  const flattenResults = (results: any[]) => results.flat()
  const flattenedTestResults = flattenResults(docs)

  // Filter results by selected date range
  const filteredResults = flattenedTestResults.filter((result: any) => {
    const testDate = new Date(result.date)
    if (startDate && testDate < startDate) return false
    if (endDate && testDate > endDate) return false
    return true
  })

  // console.log('vysledky pre pouzivatela', userData?.name || userId)

  return (
    <Box direction="col" className="w-full relative">
      <div className="w-[35rem]! md:w-[30rem] sm:w-full relative my-4">
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>

      {/* Filtered Results Section */}
      <div className="w-full space-y-2">
        {filteredResults.length > 0 ? (
          filteredResults.map((result: any, index: number) => (
            <Card
              key={index}
              className="group bg-[#0983DB]/50! rounded-2xl! max-w-[40rem] relative cursor-pointer hover:text-white!"
              onClick={() => onResultClick(result)}
            >
              <CardContent>
                <div className="flex flex-col gap-2 py-1">
                  <Typography variant="h6" className="text-black">
                    {result.testType?.name} meranie
                  </Typography>
                  <Typography variant="body1">
                    {new Date(result.date).toLocaleDateString()}{' '}
                  </Typography>
                </div>
                {/*{result.resultData?.url && (
                  <Typography>
                    Súbor:
                    <Link href={result.resultData.url} target="_blank">
                      {result.resultData.title || 'Stiahnuť'}
                    </Link>
                  </Typography>
                )}
                <Typography>Poznámky: {result.notes || ''}</Typography>
                <img
                  src={'/icon.png'}
                  alt="icon"
                  
                />*/}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 256 256"
                  className="absolute! right-4 bottom-8 fill-black group-hover:fill-white"
                >
                  <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
                </svg>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Žiadne výsledky na zobrazenie.
          </Typography>
        )}
      </div>
    </Box>
  )
}

export default TestResultsList
