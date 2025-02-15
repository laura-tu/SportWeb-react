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
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

interface BodyCompositionTableProps {
  parsedData: any
  params: any
  mapData: string[]
}

export const findLimitKey = (params: any, key: string, type: 'Lower' | 'Upper') => {
  return Object.keys(params).find(paramKey => {
    return (
      paramKey.includes(type) && // Must include "Lower" or "Upper"
      paramKey.includes(key.split(' ')[0]) // Match first word (e.g., TBW, BFM)
    )
  })
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#F882C2']

const BodyCompositionTable: React.FC<BodyCompositionTableProps> = ({
  parsedData,
  params,
  mapData,
}) => {
  const tableData: {
    name: string
    value: number | string
    lowerLimit: number | string
    upperLimit: number | string
  }[] = []

  const chartData: { name: string; value: number; color: string }[] = []
  mapData.forEach((key, index) => {
    const paramKey = Object.keys(params).find(k => k.includes(key))
    const label = paramKey ? params[paramKey] : key
    const rawValue = paramKey ? parsedData[0]?.[paramKey] : '0'
    const value = Number(rawValue.replace(',', '.')) || 'N/A'

    const lowerLimitKey = findLimitKey(params, key, 'Lower')
    const upperLimitKey = findLimitKey(params, key, 'Upper')
    const lowerLimit = lowerLimitKey ? parsedData[0]?.[lowerLimitKey] : 'N/A'
    const upperLimit = upperLimitKey ? parsedData[0]?.[upperLimitKey] : 'N/A'

    // Store for Table (Include everything)
    tableData.push({ name: label, value, lowerLimit, upperLimit })

    // Store for Pie Chart (Exclude "Váha")
    if (label !== 'Váha') {
      chartData.push({
        name: label,
        value: typeof value === 'number' ? value : 0,
        color: COLORS[index % COLORS.length],
      })
    }
  })

  return (
    <div className="flex w-[60rem] gap-6">
      {/* Table Section */}
      <div className="flex flex-col w-[50%]">
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
              {tableData.map(({ name, value, lowerLimit, upperLimit }) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>
                    {lowerLimit} - {upperLimit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pie Chart Section */}
      <div className="flex flex-col items-center">
        <Typography variant="h6" className="mt-6 mb-4 !font-bold">
          Podiel telesných parametrov
        </Typography>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  )
}

export default BodyCompositionTable
