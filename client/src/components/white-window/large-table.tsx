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
import { findLimitKey } from './body-composition-table'

interface TableProps {
  parsedData: any
  params: any
  mapData: string[]
  units: string[]
}

const LargeTable: React.FC<TableProps> = ({ parsedData, params, mapData, units }) => {
  return (
    <TableContainer component={Paper} className="mt-4">
      <Table>
        <TableHead>
          <TableRow>
            {mapData.map(key => {
              const paramKey = Object.keys(params).find(k => k.includes(key))
              const label = paramKey ? params[paramKey] : key
              return (
                <TableCell key={key} align="center" className="font-semibold!">
                  {label}
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {mapData.map((key, index) => {
              const paramKey = Object.keys(params).find(k => k.includes(key))
              const value = paramKey ? parsedData[0]?.[paramKey] : 'N/A'
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
