import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, Typography } from '@mui/material'
import Heading from '@/components/heading'

interface ChartPoint {
  date: string
  value: number | null
}

interface ComparisonChartProps {
  data: ChartPoint[]
  label: string
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, label }) => {
  const validData = [...data]
    .filter(d => d.value !== null)
    .sort((a, b) => {
      const parse = (dateStr: string) => {
        const [day, month, year] = dateStr
          .split(/[.\s]+/)
          .filter(Boolean)
          .map(Number)
        return new Date(year, month - 1, day).getTime()
      }
      return parse(a.date) - parse(b.date)
    })

  if (validData.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary" className="mt-2">
        Nie sú dostupné žiadne údaje pre „{label}“.
      </Typography>
    )
  }

  const values = validData.map(d => d.value ?? 0)
  const minY = Math.floor(Math.min(...values) - 1)
  const maxY = Math.ceil(Math.max(...values) + 1)

  return (
    <Card className="w-full mt-6 shadow-md bg-white!">
      <CardContent>
        <Heading level={6} className="p-4 font-bold! text-gray-800 " text={label} />

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={validData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" padding={{ left: 25, right: 25 }} />
              <YAxis domain={[minY, maxY]} padding={{ top: 30, bottom: 30 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null

                  const value = payload[0].value

                  return (
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: '0.75rem 1rem',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 300 }}>{label}</p>
                      <p style={{ margin: 0, color: '#1d4ed8', fontWeight: 600 }}>{value}</p>
                    </div>
                  )
                }}
              />

              <Legend />
              <Line
                type="monotone"
                label={({ x, y, value }) => (
                  <text x={x} y={y - 10} fill="#1d4ed8" fontSize={14} textAnchor="middle">
                    {value}
                  </text>
                )}
                dataKey="value"
                stroke="#1d4ed8"
                strokeWidth={3}
                name={label}
                activeDot={{ r: 8 }} // makes the hover dot bigger
                dot={{
                  stroke: '#1d4ed8',
                  strokeWidth: 2,
                  r: 5,
                  fill: '#1d4ed8',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ComparisonChart
