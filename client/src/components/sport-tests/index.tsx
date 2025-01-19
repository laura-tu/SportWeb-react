import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Link } from '@mui/material'
import { fetchUser } from '../../services/user.ts'
import LoadingOverlay from '../loading/loading-overlay.tsx'
import useFetchAthlete from '../settings/hooks/useFetchAthlete.ts'
import useFetchTestResults from './hooks/useFetchTestResults.ts'
import DateFilter from './date-filter/index.tsx'

interface SportTestsProps {
  session: any
  onResultClick: (result: any) => void
  testType: string
}

const TestResults: React.FC<SportTestsProps> = ({ session, onResultClick, testType }) => {
  const userId = session.user.id
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { testResults, isFetchingTestResults, testResultsError } = useFetchTestResults(
    testType,
    athlete?.id,
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchUser(userId)
        setUserData(data)
      } catch (err: any) {
        setError(err.message || 'Nepodarilo sa načítať údaje o používateľovi')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (loading || isFetchingTestResults || isFetchingAthleteId) {
    return <LoadingOverlay />
  }

  if (error || testResultsError || athleteError) {
    return (
      <Typography variant="h6" color="error">
        {String(error || testResultsError || athleteError)}
      </Typography>
    )
  }

  const flattenResults = (results: any[]) => results.flat()

  const flattenedTestResults = flattenResults(testResults || [])

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
