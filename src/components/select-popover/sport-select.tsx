import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@mui/material'
import { Sport } from '@/utils/interfaces'
import { fetchSports } from '@/services/sports'
import LoadingSpinner from '../loading/loading-spinner'
import { useQuery } from '@tanstack/react-query'
import { ErrorMessage } from '../error-message'

interface SportSelectProps {
  selectedSports: string[]
  onChange: (selected: string[]) => void
}

const WIDTH = 'w-[23rem]'

const SportSelect: React.FC<SportSelectProps> = ({ selectedSports, onChange }) => {
  const { data, isLoading, error } = useQuery<{ docs: Sport[] }>({
    queryKey: ['sports'],
    queryFn: fetchSports,
    refetchOnWindowFocus: false, // nemusí sa znova fetchnúť pri focusnutí okna
  })
  const sportsOptions = data?.docs || []

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
    <FormControl className="flex relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className={cn(' justify-between h-13', WIDTH)}>
            {selectedSports.length > 0
              ? selectedSports.map(id => sportsOptions.find(s => s.id === id)?.name).join(', ')
              : 'Vyber šport'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className={cn('relative left-0 mt-2 p-0  overflow-y-auto', WIDTH)}>
          <Command>
            <CommandGroup>
              {sportsOptions.map(sport => (
                <CommandItem
                  key={sport.id}
                  onSelect={() => {
                    const alreadySelected = selectedSports.includes(sport.id)
                    if (alreadySelected) {
                      onChange(selectedSports.filter(id => id !== sport.id))
                    } else {
                      onChange([...selectedSports, sport.id])
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedSports.includes(sport.id) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {sport.name}
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

export default SportSelect
