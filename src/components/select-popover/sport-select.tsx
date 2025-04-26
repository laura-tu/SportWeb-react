import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Button as SButton } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@mui/material'
import { Sport } from '@/utils/interfaces'

interface SportSelectProps {
  selectedSports: string[]
  options: Sport[]
  onChange: (selected: string[]) => void
}

const SportSelect: React.FC<SportSelectProps> = ({ selectedSports, options, onChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <Popover>
        <PopoverTrigger asChild>
          <SButton variant="outline" role="combobox" className="w-full justify-between">
            {selectedSports.length > 0
              ? options
                  .filter(sport => selectedSports.includes(sport.id))
                  .map(sport => sport.name)
                  .join(' , ')
              : 'Vyber športy'}
          </SButton>
        </PopoverTrigger>

        <PopoverContent className="relative left-0 mt-2 w-48 p-0 max-h-60 overflow-y-auto">
          <Command>
            <CommandGroup>
              {options.map(sport => (
                <CommandItem
                  key={sport.id}
                  onSelect={() => {
                    const alreadySelected = selectedSports.includes(sport.id)
                    const newSelection = alreadySelected
                      ? selectedSports.filter(id => id !== sport.id)
                      : [...selectedSports, sport.id]
                    onChange(newSelection)
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
