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

interface BodyCompositionTableProps {
  parsedData: any
  params: any
  mapData: string[]
}

const findLimitKey = (params: any, key: string, type: 'Lower' | 'Upper') => {
  return Object.keys(params).find(paramKey => {
    return (
      paramKey.includes(type) && // Must include "Lower" or "Upper"
      paramKey.includes(key.split(' ')[0]) // Match first word (e.g., TBW, BFM)
    )
  })
}

const BodyCompositionTable: React.FC<BodyCompositionTableProps> = ({
  parsedData,
  params,
  mapData,
}) => {
  return (
    <div className="flex flex-col w-[50rem]">
      <Typography variant="h6" className="mt-6 mb-4 !font-bold">
        Analýza telesného zloženia
      </Typography>
      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead className="border-b-2 border-b-blue-300">
            <TableRow>
              <TableCell>
                <strong>Parameter</strong>
              </TableCell>
              <TableCell>
                <strong>Hodnota</strong>
              </TableCell>
              <TableCell>
                <strong>Normálny Rozsah</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapData.map(key => {
              const paramKey = Object.keys(params).find(k => k.includes(key))
              const label = paramKey ? params[paramKey] : key
              const value = paramKey ? parsedData[0]?.[paramKey] : 'N/A'

              // Find the correct Lower Limit and Upper Limit keys
              const lowerLimitKey = findLimitKey(params, key, 'Lower')
              const upperLimitKey = findLimitKey(params, key, 'Upper')

              const lowerLimit = lowerLimitKey ? parsedData[0]?.[lowerLimitKey] : 'N/A'
              const upperLimit = upperLimitKey ? parsedData[0]?.[upperLimitKey] : 'N/A'

              return (
                <TableRow key={key}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>
                    {lowerLimit} - {upperLimit}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BodyCompositionTable
