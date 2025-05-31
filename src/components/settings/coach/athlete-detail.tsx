import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TestResultsWrapper } from '@/components/test-detail/test-results-wrapper'
import { TestType } from '@/components/dashboard'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useAthleteDetailQuery } from '@/api/hooks/useAthleteDetailQuery'
import { FileChartColumn } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import BreadcrumbHeader from '@/components/breadcrumb-header'
import { LayoutGrid } from 'lucide-react'

const AthleteDetail = ({ onResultClick }) => {
  const { userId } = useParams()
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null)

  const { data: athlete, isLoading } = useAthleteDetailQuery(userId)

  useEffect(() => {
    // default test (napr. InBody)
    if (!selectedTest) setSelectedTest(TestType.Inbody)
  }, [selectedTest])

  if (isLoading || !athlete) return <p>Načítavam údaje športovca...</p>

  return (
    <div>
      <div className="px-10 pt-10 mx-10">
        <BreadcrumbHeader
          title={athlete.name}
          className="text-xl"
          crumbs={[
            { icon: LayoutGrid, href: '/dashboard' },
            { label: 'Športovci', href: '/dashboard/athletes' },
            { label: athlete.name },
          ]}
        />

        <div className="flex items-center gap-4 mt-6 mb-2">
          <Avatar className="h-16 w-16">
            {/*<AvatarImage src={athlete.avatar?.url || ''} alt={athlete.name} />*/}
            <AvatarFallback>{athlete.name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{athlete.name}</h2>
            <p className="text-muted-foreground text-sm">
              Dátum narodenia: {new Date(athlete.birth_date).toLocaleDateString('sk-SK')}
            </p>
          </div>
        </div>

        <div className="mb-4 mt-10 w-96 max-w-lg flex flex-row  justify-between p-2 border border-gray-300 rounded-xl">
          <Label className="text-lg font-medium  flex flex-nowrap pr-4 ">Vyber typ testu:</Label>
          <div className="relative bg-blue-200 rounded-xl w-1/2">
            <FileChartColumn className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Select
              onValueChange={(val: TestType) => setSelectedTest(val)}
              defaultValue={TestType.Inbody}
            >
              <SelectTrigger className="pl-10 h-10 rounded-xl border border-input shadow-sm w-full">
                <SelectValue placeholder="Vyber test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TestType.Inbody}>InBody</SelectItem>
                <SelectItem value={TestType.Pnoe}>Spiroergometria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border-b border-border" />

      {selectedTest && (
        <TestResultsWrapper
          title={`Výsledky testov: ${selectedTest}`}
          testType={selectedTest}
          userId={userId}
          onResultClick={onResultClick}
        />
      )}
    </div>
  )
}

export default AthleteDetail
