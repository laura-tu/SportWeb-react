import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, TextField, List, ListItem, Button, Typography, CircularProgress } from '@mui/material'
import { updateCoachData, getCoachData } from '../../../services/coach.ts'
import { searchAthletesByName } from '../../../services/athlete.ts'

interface SearchAthleteProps {
  coachId: string
}

const SearchAthlete: React.FC<SearchAthleteProps> = ({ coachId }) => {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: searchResults,
    isLoading: isFetchingAthletes,
    error: searchError,
    refetch: refetchAthletes,
  } = useQuery({
    queryKey: ['searchAthletes', searchQuery],
    queryFn: () => searchAthletesByName(searchQuery),
    enabled: false, // Disable auto-fetching;
  })

  const patchCoachMutation = useMutation({
    mutationKey: ['update_coach_data', coachId],
    mutationFn: ({ updatedAthletes }: { updatedAthletes: string[] }) =>
      updateCoachData(coachId, { athletes: updatedAthletes }),
    onSuccess: () => {
      console.log('Athletes list updated successfully.')
      queryClient.invalidateQueries({ queryKey: ['coach', coachId] })
    },
    onError: (error: any) => {
      console.error('Failed to update coach data:', error.message)
      // Optionally show an error message to the user
    },
  })

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetchAthletes()
    }
  }

  const handleAddAthlete = async (athleteId: string) => {
    try {
      const currentCoachData = await getCoachData(coachId)
      const updatedAthletes = [
        ...new Set([
          ...(currentCoachData.athletes?.map(a => (typeof a === 'string' ? a : a.id)) || []),
          athleteId,
        ]),
      ]
      patchCoachMutation.mutate({ updatedAthletes })
    } catch (error) {
      console.error('Failed to add athlete:', error.message)
    }
  }

  return (
    <Box sx={{ pt: 2, width: { xs: '75%', sm: '65%', md: 600 } }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
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
          {isFetchingAthletes ? 'Načítavam...' : 'Vyhľadať'}
        </Button>
      </Box>

      {isFetchingAthletes && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

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
              <Button onClick={() => handleAddAthlete(athlete.id)} variant="outlined">
                {'Pridať'}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {/* Mutation Loading Indicator */}
      {patchCoachMutation.isPending && (
        <Typography color="primary" sx={{ mt: 2 }}>
          Updating coach's athletes...
        </Typography>
      )}
    </Box>
  )
}

export default SearchAthlete
