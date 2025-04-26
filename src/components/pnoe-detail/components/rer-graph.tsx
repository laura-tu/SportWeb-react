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

const RERGraph: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
        <Legend verticalAlign="top" height={36} />
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-axis = Time */}
        <XAxis
          dataKey="time"
          label={{ value: 'Time (sec)', position: 'insideBottom', offset: -15 }}
          domain={['auto', 'auto']}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(0) : tick)}
        />

        {/* Y-axis = RER */}
        <YAxis
          label={{
            value: 'RER',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
          domain={[0.5, 'dataMax + 0.1']}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(2) : tick)} // RER is usually a float with 2 decimals
        />

        <Tooltip />

        {/* Plot RER line */}
        <Line
          type="monotone"
          dataKey="RER"
          stroke="#3cb371"
          strokeWidth={2}
          dot={false}
          name="RER"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default RERGraph
