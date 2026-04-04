import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts'

export const formatY = (v) => '$' + (v / 1000).toFixed(0) + 'k'
export const formatTooltip = (v, name) => ['$' + Math.round(v).toLocaleString('en-US'), name]
export const formatLabel = (l) => `Month ${l}`

function CashFlowChart({ dataA, dataB, validA, validB, darkMode }) {
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

  const gridColor  = darkMode ? '#1e293b' : '#f0f4f8'
  const axisColor  = darkMode ? '#94a3b8' : '#64748b'
  const refColor   = darkMode ? '#475569' : '#94a3b8'
  const tooltipBg  = darkMode ? '#1e293b' : '#fff'
  const tooltipBorder = darkMode ? '#334155' : '#e2e8f0'
  const tooltipText = darkMode ? '#f1f5f9' : '#1e293b'

  return (
    <div className="card">
      <h2>Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={merged} margin={{ top: 5, right: 24, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            tick={{ fill: axisColor }}
            label={{ value: 'Month', position: 'insideBottom', offset: -12, fill: axisColor }}
          />
          <YAxis tickFormatter={formatY} width={56} tick={{ fill: axisColor }} />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={formatLabel}
            contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, color: tooltipText }}
            labelStyle={{ color: tooltipText }}
          />
          <Legend verticalAlign="top" height={32} wrapperStyle={{ color: axisColor }} />
          <ReferenceLine
            y={0}
            stroke={refColor}
            strokeDasharray="6 3"
            label={{ value: 'Break-even', position: 'insideTopRight', fontSize: 11, fill: refColor }}
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
