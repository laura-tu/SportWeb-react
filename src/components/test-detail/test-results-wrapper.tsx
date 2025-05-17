import React from 'react'
import Heading from '../heading'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import TestResultsList from '../tests-list'

export function TestResultsWrapper({ title, testType, userId, onResultClick }) {
  return (
    <div className="p-10 mx-10">
      <Heading level={4} text={title} className="py-4"/>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TestResultsList userId={userId} onResultClick={onResultClick} testType={testType} />
      </LocalizationProvider>
    </div>
  )
}
