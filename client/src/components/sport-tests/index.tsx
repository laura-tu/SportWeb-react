import React, { useState } from 'react'
import { Box, Typography, Card, CardContent, Link } from '@mui/material'
import LoadingOverlay from '../loading/loading-overlay'
import useFetchAthlete from '../settings/hooks/useFetchAthlete'
import useFetchTestResults from './hooks/useFetchTestResults'
import DateFilter from './date-filter/index'
import useFetchUserById from '../../utils/api/useFetchUserById'

interface SportTestsProps {
  userId: string
  onResultClick: (result: any) => void
  testType: string
}

const TestResults: React.FC<SportTestsProps> = ({ userId, onResultClick, testType }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { testResults, isFetchingTestResults, testResultsError } = useFetchTestResults(
    testType,
    athlete?.id,
  )

  const { data: userData, isLoading, error } = useFetchUserById(userId)

  if (isLoading || isFetchingTestResults || isFetchingAthleteId) {
    return <LoadingOverlay />
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
    <Box className="flex flex-col w-full p-4">
      <Box className="w-full my-2">
        <Typography variant="h5" gutterBottom>
          Výsledky pre používateľa: {userData?.name || userId}
        </Typography>
      </Box>

      {/* Use the DateFilter component here */}
      <DateFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      {/* Filtered Results Section */}
      <Box className="w-full my-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((result: any, index: number) => (
            <Card
              key={index}
              className="mb-4"
              onClick={() => onResultClick(result)}
              sx={{ cursor: 'pointer' }}
            >
              <CardContent>
                <Typography variant="h6">
                  Dátum: {new Date(result.date).toLocaleDateString()}
                </Typography>
                <Typography>Typ testu: {result.testType?.name}</Typography>
                {result.resultData?.url && (
                  <Typography>
                    Súbor:
                    <Link href={result.resultData.url} target="_blank">
                      {result.resultData.title || 'Stiahnuť'}
                    </Link>
                  </Typography>
                )}
                <Typography>Poznámky: {result.notes || ''}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Žiadne výsledky na zobrazenie.
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default TestResults
