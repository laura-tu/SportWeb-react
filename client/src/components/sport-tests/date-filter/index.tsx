import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Box, Button, Typography } from '@mui/material'
import { startOfDay, endOfDay, isAfter, isBefore } from 'date-fns'

interface DateFilterProps {
  startDate: Date | null
  endDate: Date | null
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [dateError, setDateError] = useState<string | null>(null)

  const handleStartDateChange = (newValue: Date | null) => {
    const newStartDate = startOfDay(newValue ? newValue : new Date())
    // Check if startDate is after endDate
    if (endDate && isBefore(endDate, newStartDate)) {
      setDateError('Skontrolujte si dátumy. Začiatočný dátum nemôže byť po koncovom.')
    } else {
      setDateError(null)
      setStartDate(newStartDate)
    }
  }

  const handleEndDateChange = (newValue: Date | null) => {
    const newEndDate = endOfDay(newValue ? newValue : new Date())
    // Check if endDate is before startDate
    if (startDate && isAfter(startDate, newEndDate)) {
      setDateError('Skontrolujte si dátumy. Koncový dátum nemôže byť pred začiatočným.')
    } else {
      setDateError(null)
      setEndDate(newEndDate)
    }
  }

  return (
    <Box>
      <Box className="w-full my-4 flex gap-4">
        <DatePicker
          label="Od dátumu"
          value={startDate}
          onChange={handleStartDateChange}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label="Do dátumu"
          value={endDate}
          onChange={handleEndDateChange}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setStartDate(null)
            setEndDate(null)
            setDateError(null)
          }}
        >
          Vymazať filter
        </Button>
      </Box>

      <Box className="w-full my-4 flex gap-4">
        {dateError && <Typography color="error">{dateError}</Typography>}
      </Box>
    </Box>
  )
}

export default DateFilter
