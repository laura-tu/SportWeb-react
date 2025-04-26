import React, { useState } from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import Image from 'mui-image'
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

  return (
    <Box direction="col" className="w-full p-4 relative">
      <Box direction="row" className="w-full my-2 flex-wrap justify-between">
        <Typography variant="h5" gutterBottom>
          Výsledky pre používateľa: {userData?.name || userId}
        </Typography>

        <div className="w-[35rem]! md:w-[30rem] sm:w-full relative my-4">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
      </Box>

      {/* Filtered Results Section */}
      <div className="w-full ">
        {filteredResults.length > 0 ? (
          filteredResults.map((result: any, index: number) => (
            <Card
              key={index}
              className="mt-4 bg-[#0983DB]/80! rounded-2xl! max-w-[40rem] relative"
              onClick={() => onResultClick(result)}
              sx={{ cursor: 'pointer' }}
            >
              <CardContent>
                <Typography variant="h6">{result.testType?.name} meranie</Typography>
                <Typography variant="body1" className="pt-4">
                  {new Date(result.date).toLocaleDateString()}{' '}
                </Typography>
                {/*{result.resultData?.url && (
                  <Typography>
                    Súbor:
                    <Link href={result.resultData.url} target="_blank">
                      {result.resultData.title || 'Stiahnuť'}
                    </Link>
                  </Typography>
                )}
                <Typography>Poznámky: {result.notes || ''}</Typography>*/}
                <Image
                  src={'/icon.png'}
                  alt="icon"
                  className="w-16! h-14! absolute! right-4 bottom-6"
                />
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
