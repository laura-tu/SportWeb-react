import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@mui/material'
import LoadingSpinner from '../loading/loading-spinner'
import { ErrorMessage } from '../error-message'
import { useFetchSportClubs } from '@/api/hooks/useFetchSportClubs'

interface ClubSelectProps {
  selectedClub?: string
  onChange: (selected: string) => void
}

const WIDTH = 'w-[23rem]'

const ClubSelect: React.FC<ClubSelectProps> = ({ selectedClub, onChange }) => {
  const { data, isLoading, error } = useFetchSportClubs()
  const clubOptions = data?.docs || []

  if (isLoading) {
    return (
      <div className="h-[3.25rem] flex items-center justify-center border rounded-md bg-white shadow-sm">
        <LoadingSpinner small />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[3.25rem] flex items-center justify-center">
        <ErrorMessage message="Nepodarilo sa načítať športy" />
      </div>
    )
  }

  return (
    <FormControl className="flex relative mb-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn('h-13 justify-between text-lg', WIDTH)}
          >
            {selectedClub
              ? (clubOptions.find(club => club.id === selectedClub)?.name ?? 'Vyber klub')
              : 'Vyber klub'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className={cn('w-full p-0', WIDTH)}>
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
                        'mr-2 h-5 w-4',
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
