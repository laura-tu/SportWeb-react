import React, { useState } from 'react'
import { Typography, Card, CardContent } from '@mui/material'
import LoadingSpinner from '../loading/loading-spinner'
import { useFetchAthlete } from '../../api/hooks/useAthleteQuery'
import useFetchTestResults from './hooks/useFetchTestResults'
import DateFilter from './date-filter/index'
//import { useFetchUserById } from '@/api/hooks/useUserQuery'
import Box from '@/components/box'
import PnoeComparisonPanel from './comparison-panel/pnoe-comparison'
import InbodyComparisonPanel from './comparison-panel/inbody-comparison'

interface SportTestsProps {
  userId: string
  onResultClick: (result: any) => void
  testType: string
}

const TestResultsList: React.FC<SportTestsProps> = ({ userId, onResultClick, testType }) => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const {
    data: athlete,
    isLoading: isFetchingAthleteId,
    error: athleteError,
  } = useFetchAthlete(userId)

  const { testResults, isFetchingTestResults, testResultsError } = useFetchTestResults(
    testType,
    athlete?.id,
  )
  //const { data: userData, isLoading, error } = useFetchUserById(userId)

  if (isFetchingTestResults || isFetchingAthleteId) {
    return <LoadingSpinner />
  }

  if (testResultsError || athleteError) {
    return (
      <Typography variant="h6" color="error">
        {String(testResultsError || athleteError)}
      </Typography>
    )
  }

  const docs = testResults || []
  const flattenResults = (results: any[]) => results.flat()
  const flattenedTestResults = flattenResults(docs)

  const filteredResults = flattenedTestResults.filter((result: any) => {
    const testDate = new Date(result.date)
    if (startDate && testDate < startDate) return false
    if (endDate && testDate > endDate) return false
    return true
  })

  const resultsMap = new Map<string, any>()
  filteredResults.forEach(result => {
    const dateKey = new Date(result.date).toISOString().split('T')[0]
    resultsMap.set(dateKey, result)
  })

  const testTypeName = filteredResults[0]?.testType?.name || ''

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

      <div className="w-full space-y-2">
        {filteredResults.length > 0 ? (
          <div className="w-full flex flex-wrap gap-4">
            {filteredResults.map((result: any, index: number) => (
              <Card
                key={index}
                className="group bg-[#0983DB]/50! rounded-2xl! w-full sm:w-[20rem] md:w-[28.5rem] cursor-pointer relative hover:text-white transition"
                onClick={() => onResultClick(result)}
              >
                <CardContent>
                  <div className="flex flex-col gap-2 py-1">
                    <Typography variant="h6" className="text-black">
                      {result.testType?.name} meranie
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-black group-hover:text-white transition font-semibold!"
                    >
                      {new Date(result.date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 256 256"
                    className="absolute! right-4 bottom-8 fill-black group-hover:fill-white"
                  >
                    <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
                  </svg>
                </CardContent>
              </Card>
            ))}

            <div className="w-full mt-8">
              {testTypeName === 'INBODY' ? (
                <InbodyComparisonPanel results={filteredResults} />
              ) : (
                <PnoeComparisonPanel results={filteredResults} />
              )}
            </div>
          </div>
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
