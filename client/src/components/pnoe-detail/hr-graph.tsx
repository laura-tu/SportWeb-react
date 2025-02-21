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

const HRGraph: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <Legend verticalAlign="top" height={36} />
        <XAxis
          dataKey="time"
          label={{ value: 'Time (sec)', position: 'insideBottom', offset: -15 }}
          domain={['auto', 'auto']}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(0) : tick)}
        />

        <YAxis label={{ value: 'HR (bpm)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="HR" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default HRGraph
