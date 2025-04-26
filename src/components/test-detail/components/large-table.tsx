import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
import { findLimitKey, mapParsedData } from '@/utils/dataUtils'

interface TableProps {
  parsedData: any
  params: any
  mapData: string[]
  units: string[]
}

const LargeTable: React.FC<TableProps> = ({ parsedData, params, mapData, units }) => {
  const tableData = mapParsedData(mapData, parsedData, params)

  return (
    <TableContainer component={Paper} className="mt-4">
      <Table>
        <TableHead>
          <TableRow>
            {tableData.map(({ key, label }) => (
              <TableCell key={key} align="center" className="font-semibold!">
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {tableData.map(({ key, value }, index) => {
              const lowerLimitKey = findLimitKey(params, key, 'Lower')
              const upperLimitKey = findLimitKey(params, key, 'Upper')
              const lowerLimit = lowerLimitKey ? parsedData[0]?.[lowerLimitKey] : 'N/A'
              const upperLimit = upperLimitKey ? parsedData[0]?.[upperLimitKey] : 'N/A'
              const unit = units[index] || ''

              return (
                <TableCell key={key} align="center">
                  <Typography variant="body1" className="font-semibold!">
                    {value} {unit}
                  </Typography>
                  <Typography variant="body2">
                    ({lowerLimit} - {upperLimit})
                  </Typography>
                </TableCell>
              )
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default LargeTable
