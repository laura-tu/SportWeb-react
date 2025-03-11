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

const VO2VCO2Graph: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
        <Legend verticalAlign="top" height={36} />
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="time"
          label={{ value: 'Time (sec)', position: 'insideBottom', offset: -15 }}
          domain={['auto', 'auto']}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(0) : tick)}
        />

        <YAxis
          width={80}
          stroke="black"
          label={{
            value: 'VO2 & VCO2 (ml/min)',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' },
          }}
          domain={[0, 'dataMax + 500']}
          tickFormatter={tick => (typeof tick === 'number' ? tick.toFixed(0) : tick)}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="VO2(ml/min)"
          stroke="#e60026"
          strokeWidth={2}
          dot={false}
          name="VO2 (ml/min)"
        />

        <Line
          type="monotone"
          dataKey="VCO2(ml/min)"
          stroke="#33A8FF"
          strokeWidth={2}
          dot={false}
          name="VCO2 (ml/min)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default VO2VCO2Graph
