import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const WattsGraph: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
        <Legend verticalAlign="top" height={36} />
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="time"
          label={{ value: 'Time (sec)', position: 'insideBottom', offset: -10 }}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(0) : tick)}
        />

        <YAxis
          width={80}
          stroke="black"
          label={{
            value: 'Watts',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
          domain={[0, 'dataMax + 30']}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(0) : tick)}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="Watts"
          stroke="#ff7f0e"
          strokeWidth={2}
          dot={false}
          name="Watts"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default WattsGraph
