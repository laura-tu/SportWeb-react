import React, { useEffect, useState, forwardRef } from 'react'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { fetchSports } from '../../../../services/sports'

interface SportFieldProps {
  value: string | string[]
  onChange: (value: string[]) => void
  control: any
}

const SportField = forwardRef<HTMLDivElement, SportFieldProps>(({ value, onChange, control }, ref) => {
  const [sports, setSports] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSports = async () => {
      try {
        const sportsData = await fetchSports()
        setSports(sportsData)
      } catch (error) {
        console.error('Error fetching sports:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSports()
  }, [])

  return (
    <FormControl ref={ref}>
      <FormField
        name="sport"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Šport</FormLabel>
            <Select
              value={value || []}
              onValueChange={selectedValue => {
                if (Array.isArray(selectedValue)) {
                  onChange(selectedValue) // Handle multiple selections
                } else {
                  onChange([selectedValue]) // For single selection, wrap in an array
                }
              }}
              disabled={loading}
              {...field}
            >
              <SelectTrigger className="w-full py-2 px-3 border border-gray-300 rounded-md">
                <SelectValue placeholder="Vyberte šport" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  sports.map(sport => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormControl>
  )
})

SportField.displayName = 'SportField' // This is necessary for debugging and dev tools

export default SportField
