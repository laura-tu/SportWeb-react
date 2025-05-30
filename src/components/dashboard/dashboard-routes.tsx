import React, { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { CSportTest, TestResult } from '@/utils/interfaces'
import { TestType } from '.'
import DemoPageContent from './demo-page-content'
import SettingsLayout from '../settings/settings-layout'
import TestDetailWindow from '../test-detail'
import { TestResultsWrapper } from '../test-detail/test-results-wrapper'
import SpiroergometryDetail from '../pnoe-detail'
import AthletesTable from '../settings/coach/athletes-table'

export function getTestTypeName(testType: string | CSportTest): string {
  return typeof testType === 'string' ? testType : testType.name
}

export function DashboardRoutes({ session }) {
  const navigate = useNavigate()
  const [currentForm, setCurrentForm] = useState<'athlete' | 'coach' | 'password' | null>(() => {
    const roles = session?.user?.roles
    if (Array.isArray(roles) && roles.includes('user')) {
      return 'athlete'
    }
    return 'coach'
  })
  const [selectedTestResult, setSelectedTestResult] = useState<TestResult | null>(null)

  const handleResultClick = (result: TestResult) => {
    if (!result?.id) return console.error('Chýba ID testu!')
    setSelectedTestResult(result)

    const route =
      getTestTypeName(result.testType) === TestType.Inbody
        ? `/dashboard/test_results/inbody_results/${result.id}`
        : `/dashboard/test_results/spiroergometry/${result.id}`

    navigate(route)
  }

  const isCoach = Array.isArray(session?.user?.roles) && session.user.roles.includes('sportCoach')

  return (
    <Routes>
      <Route path="/" element={<DemoPageContent userId={session.user.id} />} />
      <Route
        path="settings"
        element={
          <div className="p-10">
            <SettingsLayout
              session={session}
              currentForm={currentForm}
              setCurrentForm={setCurrentForm}
            />
          </div>
        }
      />

      <Route
        path="athletes"
        element={
          <div className="p-10">
            <AthletesTable userId={session.user.id} />
          </div>
        }
      />
      <Route
        path="test_results/inbody_results"
        element={
          isCoach ? (
            <DemoPageContent userId={session.user.id} />
          ) : (
            <TestResultsWrapper
              title="Výsledky testov z Inbody merania"
              testType={TestType.Inbody}
              userId={session.user.id}
              onResultClick={handleResultClick}
            />
          )
        }
      />
      <Route
        path="test_results/spiroergometry"
        element={
          isCoach ? (
            <DemoPageContent userId={session.user.id} />
          ) : (
            <TestResultsWrapper
              title="Výsledky testov zo spiroergometrie"
              testType={TestType.Pnoe}
              userId={session.user.id}
              onResultClick={handleResultClick}
            />
          )
        }
      />
      <Route
        path="test_results/inbody_results/:resultId"
        element={<TestDetailWindow result={selectedTestResult} />}
      />
      <Route
        path="test_results/spiroergometry/:resultId"
        element={<SpiroergometryDetail result={selectedTestResult} />}
      />
      <Route path="*" element={<DemoPageContent userId={session.user.id} />} />
    </Routes>
  )
}
