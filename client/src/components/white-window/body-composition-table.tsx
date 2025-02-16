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
import { mapParsedData, mapChartData, findLimitKey } from '@/utils/dataUtils'
import BodyCompositionPieChart from './body-composition-piechart'

interface BodyCompositionTableProps {
  parsedData: any
  params: any
  mapData: string[]
  units: string[]
}

const BodyCompositionTable: React.FC<BodyCompositionTableProps> = ({
  parsedData,
  params,
  mapData,
  units,
}) => {
  const tableData = mapParsedData(mapData, parsedData, params).map(({ label, value }, index) => ({
    name: label,
    value,
    unit: units[index] || '',
    lowerLimit: findLimitKey(params, mapData[index], 'Lower')
      ? parsedData[0]?.[findLimitKey(params, mapData[index], 'Lower')]
      : 'N/A',
    upperLimit: findLimitKey(params, mapData[index], 'Upper')
      ? parsedData[0]?.[findLimitKey(params, mapData[index], 'Upper')]
      : 'N/A',
  }))

  const chartData = mapChartData(mapData, parsedData, params)

  return (
    <div className="flex w-[60rem] gap-6 flex-wrap">
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
              {tableData.map(({ name, value, unit, lowerLimit, upperLimit }) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    {value} {unit}
                  </TableCell>
                  <TableCell>
                    {lowerLimit} - {upperLimit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <BodyCompositionPieChart chartData={chartData} />
    </div>
  )
}

export default BodyCompositionTable
