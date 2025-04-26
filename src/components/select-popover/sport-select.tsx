import React, { useState, useEffect } from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FormControl } from '@mui/material'
import { Sport } from '@/utils/interfaces'
import { fetchSports } from '@/services/sports'

interface SportSelectProps {
  selectedSports: string[]
  onChange: (selected: string[]) => void
}

const SportSelect: React.FC<SportSelectProps> = ({ selectedSports, onChange }) => {
  const [sportsOptions, setSportsOptions] = useState<Sport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSports = async () => {
      try {
        const sportsData = await fetchSports()
        setSportsOptions(sportsData?.docs || [])
      } catch (error) {
        console.error('Error fetching sports:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSports()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <FormControl fullWidth margin="normal">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="w-full justify-between">
            {selectedSports.length > 0
              ? selectedSports.map(id => sportsOptions.find(s => s.id === id)?.name).join(', ')
              : 'Vyber šport'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="relative left-0 mt-2 w-48 p-0 max-h-60 overflow-y-auto">
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
