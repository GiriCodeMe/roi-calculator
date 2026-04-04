import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts'

export const formatY = (v) => '$' + (v / 1000).toFixed(0) + 'k'
export const formatTooltip = (v, name) => ['$' + Math.round(v).toLocaleString('en-US'), name]
export const formatLabel = (l) => `Month ${l}`

function CashFlowChart({ dataA, dataB, validA, validB }) {
  if (!validA && !validB) {
    return (
      <div className="card">
        <h2>Cumulative Cash Flow</h2>
        <p className="disabled-msg">Fix the errors above to see the chart</p>
      </div>
    )
  }

  const maxLen = Math.max(
    validA ? dataA.length : 0,
    validB ? dataB.length : 0,
  )

  const merged = Array.from({ length: maxLen }, (_, i) => ({
    month: i + 1,
    ...(validA ? { 'Scenario A': dataA[i]?.cashFlow ?? null } : {}),
    ...(validB ? { 'Scenario B': dataB[i]?.cashFlow ?? null } : {}),
  }))

  return (
    <div className="card">
      <h2>Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={merged} margin={{ top: 5, right: 24, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -12 }}
          />
          <YAxis tickFormatter={formatY} width={56} />
          <Tooltip formatter={formatTooltip} labelFormatter={formatLabel} />
          <Legend verticalAlign="top" height={32} />
          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="6 3"
            label={{ value: 'Break-even', position: 'insideTopRight', fontSize: 11, fill: '#94a3b8' }}
          />
          {validA && (
            <Line
              type="monotone"
              dataKey="Scenario A"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          )}
          {validB && (
            <Line
              type="monotone"
              dataKey="Scenario B"
              stroke="#ea580c"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CashFlowChart
