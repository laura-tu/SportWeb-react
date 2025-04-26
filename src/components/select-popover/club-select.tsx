import React, { useState, useEffect } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@mui/material'
import { Club } from '@/utils/interfaces'
import { fetchSportClubs } from '@/services/sport-clubs'

interface ClubSelectProps {
  selectedClub?: string
  onChange: (selected: string) => void
}

const ClubSelect: React.FC<ClubSelectProps> = ({ selectedClub, onChange }) => {
  const [clubOptions, setClubOptions] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const clubs = await fetchSportClubs()
        setClubOptions(clubs)
      } catch (error) {
        console.error('Error fetching clubs:', error)
      } finally {
        setLoading(false)
      }
    }

    loadClubs()
  }, [])

  if (loading) {
    return <div>Loading clubs...</div>
  }

  return (
    <FormControl fullWidth margin="normal">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selectedClub
              ? (clubOptions.find(club => club.id === selectedClub)?.name ?? 'Vyber klub')
              : 'Vyber klub'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandGroup>
              {clubOptions.map(club => (
                <CommandItem
                  key={club.id}
                  onSelect={() => {
                    onChange(club.id) // When a club is selected, pass its ID to `onChange`
                  }}
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedClub === club.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {club.name}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </FormControl>
  )
}

export default ClubSelect
