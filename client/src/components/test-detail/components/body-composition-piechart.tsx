import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { Typography } from '@mui/material'

interface PieChartProps {
  chartData: { name: string; value: number; color: string }[]
}

const BodyCompositionPieChart: React.FC<PieChartProps> = ({ chartData }) => {
  return (
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
  )
}

export default BodyCompositionPieChart
