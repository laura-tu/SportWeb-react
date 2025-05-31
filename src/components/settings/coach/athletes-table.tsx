import React from 'react'
import { useCoachQuery } from '@/api/hooks/useCoachQuery'
import Box from '@/components/box'
import Heading from '@/components/heading'
import SearchAthlete from './search-athlete'
import LoadingSpinner from '@/components/loading/loading-spinner'
import { ErrorMessage } from '@/components/error-message'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import { Mars, Venus, FileUser } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export interface CoachProps {
  userId: string
}

const AthletesTable: React.FC<CoachProps> = ({ userId }) => {
  const { data, isLoading, error } = useCoachQuery(userId)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Box direction="col" className="text-center mt-4">
        <ErrorMessage message="Nepodarilo sa načítať dáta trénera." />
      </Box>
    )
  }

  const coach = data?.docs[0]

  if (!coach) {
    return (
      <Box direction="col" className="text-center mt-4">
        <p className="text-muted-foreground">Nepodarilo sa nájsť trénera s týmto ID.</p>
      </Box>
    )
  }

  const athletes = coach.athletes || []

  return (
    <Box direction="col">
      <Box direction="col" className="mb-4 gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sportovci" className="font-medium text-foreground">
                Športovci
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Heading level={4} text="Športovci" />
        <p className="text-muted-foreground">
          Toto je zoznam športovcov vedených trénerom <strong>{coach.name}</strong>.
        </p>

        {athletes.length === 0 && (
          <p className="text-muted-foreground mt-2">
            Tento tréner nemá zatiaľ pridelených športovcov.
          </p>
        )}

        <SearchAthlete coachId={coach.id} userId={userId} />
      </Box>

      {athletes.length > 0 && (
        <div className="mb-4 gap-4 mt-6 border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Športovec</TableHead>
                <TableHead className="text-center">Pohlavie</TableHead>
                <TableHead className="text-center">Dátum narodenia</TableHead>
                <TableHead className="text-center">Náhľad výsledkov</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {athletes.map(
                ath =>
                  typeof ath !== 'string' && (
                    <TableRow key={ath.id}>
                      <TableCell className="text-center">{ath.name || 'Neznámy'}</TableCell>
                      <TableCell className="place-items-center ">
                        {ath.gender === 'muz' ? (
                          <Mars color="#ACD0F9" />
                        ) : (
                          <Venus color="#FAB4BE" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(ath.birth_date).toLocaleDateString('sk-SK')}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => console.log(ath.id)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title="open-results"
                        >
                          <FileUser className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Box>
  )
}

export default AthletesTable
