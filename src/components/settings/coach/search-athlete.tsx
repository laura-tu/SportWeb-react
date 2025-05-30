import React, { useState } from 'react'
import { TextField, List, ListItem, Button, Typography } from '@mui/material'
import LoadingSpinner from '@/components/loading/loading-spinner'
import Box from '@/components/box'
import { useSearchAthletes } from '@/api/hooks/useAthleteQuery'
import { useUpdateCoach } from '@/api/hooks/useCoachQuery'
import { useAddAthleteToCoach } from '@/api/hooks/useCoachQuery'

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetchAthletes()
    }
  }

  const { addAthlete, isPending, isCoachLoading, coachError } = useAddAthleteToCoach(
    coachId,
    userId,
  )

  return (
    <Box className="pt-2 w-full sm:w-[65%] md:w-[600px]">
      <Box className="flex gap-2">
        <TextField
          label="napr. Janko Hraško"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          fullWidth
        />
        <Button
          onClick={handleSearch}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
          disabled={isFetchingAthletes || patchCoachMutation.isPending}
        >
          {isFetchingAthletes ? <LoadingSpinner small /> : 'Vyhľadať'}
        </Button>
      </Box>

      {isFetchingAthletes && <LoadingSpinner />}

      {searchError && (
        <Typography color="error" sx={{ mt: 2 }}>
          Nepodarilo sa nájsť športovca v databáze. Skúste to znova neskôr.
        </Typography>
      )}

      {searchResults && (
        <List sx={{ mt: 2, mb: 5 }}>
          {searchResults.map(athlete => (
            <ListItem
              key={athlete.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography>{athlete.name || 'Neznámy'}</Typography>
              {/* Fallback to 'Unknown' if name is null */}
              <Button onClick={() => addAthlete(athlete.id)} variant="outlined">
                {'Pridať'}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {/* Mutation Loading Indicator */}
      {patchCoachMutation.isPending && (
        <Typography color="primary" sx={{ mt: 2 }}>
          Aktualizuje sa zoznam trénerových zverencov...
        </Typography>
      )}
    </Box>
  )
}

export default SearchAthlete
