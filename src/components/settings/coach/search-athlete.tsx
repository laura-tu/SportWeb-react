import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchAthletes } from '@/api/hooks/useAthleteQuery'
import { useUpdateCoach, useAddAthleteToCoach } from '@/api/hooks/useCoachQuery'
import LoadingSpinner from '@/components/loading/loading-spinner'
import Box from '@/components/box'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ErrorMessage } from '@/components/error-message'

interface SearchAthleteProps {
  coachId: string
  userId: string
}

const SearchAthlete: React.FC<SearchAthleteProps> = ({ coachId, userId }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: searchResults,
    isLoading: isFetchingAthletes,
    error: searchError,
    refetch: refetchAthletes,
  } = useSearchAthletes(searchQuery)

  const patchCoachMutation = useUpdateCoach(coachId)

  const {
    addAthlete,
    isPending: isAddingAthlete,
    coachError,
  } = useAddAthleteToCoach(coachId, userId)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetchAthletes()
    }
  }

  return (
    <Box className="pt-2 w-full sm:w-[65%] md:w-[600px]">
      <Box direction="col" className="flex gap-2 my-4">
        <div className="text-gray-500">Vyhľadaj športovca podľa mena</div>
        <Input
          placeholder="napr. Janko Hraško"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-grow min-w-80"
        />
        <Button
          onClick={handleSearch}
          disabled={isFetchingAthletes || patchCoachMutation.isPending}
        >
          {isFetchingAthletes ? <LoadingSpinner small /> : 'Vyhľadať'}
        </Button>
      </Box>

      {searchError && (
        <ErrorMessage message="Nepodarilo sa nájsť športovca v databáze. Skúste to znova neskôr." />
      )}

      {coachError && (
        <ErrorMessage message="Zlyhalo pridávanie športovca. Skúste to znova neskôr." />
      )}

      {searchResults && searchResults.length > 0 && (
        <ScrollArea className="border rounded-md ml-8 h-fit mt-12 bg-blue-50">
          <ul className="divide-y">
            {searchResults.map(athlete => (
              <li key={athlete.id} className="flex justify-between items-center p-3 w-[15rem] h-13">
                <div className="m-1 min-w-28">
                  <span>
                    <strong>{athlete.name || 'Neznámy'}</strong>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-300 px-4 hover:bg-blue-900 hover:text-white"
                  onClick={() => addAthlete(athlete.id)}
                >
                  Pridať
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}

      {isAddingAthlete && (
        <div className="text-blue-600 text-sm mt-4">
          Aktualizuje sa zoznam trénerových zverencov...
        </div>
      )}
    </Box>
  )
}

export default SearchAthlete
