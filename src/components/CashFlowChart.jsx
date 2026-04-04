import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts'

const formatY = (v) => '$' + (v / 1000).toFixed(0) + 'k'
const formatTooltip = (v) => ['$' + Math.round(v).toLocaleString('en-US'), 'Cash Flow']

function CashFlowChart({ data }) {
  return (
    <div className="card">
      <h2>Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 24, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -12 }}
          />
          <YAxis tickFormatter={formatY} width={56} />
          <Tooltip formatter={formatTooltip} labelFormatter={(l) => `Month ${l}`} />
          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="6 3"
            label={{ value: 'Break-even', position: 'insideTopRight', fontSize: 11, fill: '#94a3b8' }}
          />
          <Line
            type="monotone"
            dataKey="cashFlow"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CashFlowChart
