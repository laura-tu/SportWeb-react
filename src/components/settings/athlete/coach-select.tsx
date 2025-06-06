import React from 'react'
import { FormControl } from '@mui/material'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

interface CoachSelectProps {
  coachName: string
}

const WIDTH = 'w-[23rem]'

const CoachSelect: React.FC<CoachSelectProps> = ({ coachName }) => {
  return (
    <FormControl className="flex relative mb-10">
      <Input
        type="text"
        value={coachName || 'Žiadny tréner'}
        readOnly
        className={cn('text-gray-700 text-lg bg-gray-100 cursor-not-allowed', WIDTH)}
      />
    </FormControl>
  )
}

export default CoachSelect
