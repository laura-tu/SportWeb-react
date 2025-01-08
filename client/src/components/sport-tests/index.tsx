import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Link } from '@mui/material'
import { fetchUser } from '../../services/user.ts'
import LoadingOverlay from '../loading/loading-overlay.tsx'
import useFetchAthlete from '../settings/hooks/useFetchAthlete.ts'
import useFetchTestResults from './hooks/useFetchTestResults.ts'

interface SportTestsProps {
  session: any
}

const TestResults: React.FC<SportTestsProps> = ({ session }) => {
  const userId = session.user.id
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { athlete, isFetchingAthleteId, athleteError } = useFetchAthlete(userId)
  const { testResults, isFetchingTestResults, testResultsError } = useFetchTestResults(athlete?.id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchUser(userId)
        setUserData(data)
      } catch (err: any) {
        setError(err.message || 'Error fetching user data')
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

  return (
    <Box className="flex flex-col w-full p-4">
      <Box className="w-full my-2">
        <Typography variant="h5" gutterBottom>
          Výsledky pre používateľa: {userData?.name || userId}
        </Typography>
      </Box>

      <Box className="w-full my-4">
        {flattenedTestResults.length > 0 ? (
          flattenedTestResults.map((result: any, index: number) => (
            <Card key={index} className="mb-4">
              <CardContent>
                <Typography variant="h6">
                  Dátum: {new Date(result.date).toLocaleDateString() || 'N/A'}
                </Typography>
                <Typography>Typ testu: {result.testType?.name || 'N/A'}</Typography>
                {result.resultData?.url && (
                  <Typography>
                    Súbor na stiahnutie:{' '}
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
          <Typography variant="body1">Žiadne výsledky na zobrazenie.</Typography>
        )}
      </Box>
    </Box>
  )
}

export default TestResults
