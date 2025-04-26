import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Button as SButton } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@mui/material'
import { Club } from '@/utils/interfaces'

interface ClubSelectProps {
  selectedClub?: string
  options: Club[]
  onChange: (selected: string) => void
}

const ClubSelect: React.FC<ClubSelectProps> = ({ selectedClub, options, onChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <Popover>
        <PopoverTrigger asChild>
          <SButton variant="outline" role="combobox" className="w-full justify-between">
            {selectedClub
              ? (options.find(club => club.id === selectedClub)?.name ?? 'Vyber klub')
              : 'Vyber klub'}
          </SButton>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandGroup>
              {options.map(club => (
                <CommandItem
                  key={club.id}
                  onSelect={() => {
                    onChange(club.id)
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
