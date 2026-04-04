import { useState } from 'react'
import { formatCurrency } from '../utils/currency'

function BreakdownTable({ label, results, inputs, colorClass, disabled, currency = 'USD' }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={`card ${colorClass}`}>
      <div className="table-header">
        <h2>{label} — Monthly Breakdown</h2>
        <button
          className={`toggle-btn ${colorClass}`}
          onClick={() => setVisible(v => !v)}
          disabled={disabled}
        >
          {visible ? 'Hide Table' : 'Show Table'}
        </button>
      </div>

      {disabled && <p className="disabled-msg">Fix the errors above to see the table</p>}

      {!disabled && visible && (
        <div className="table-wrapper">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Monthly Revenue</th>
                <th>Monthly Costs</th>
                <th>Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {results.cashFlowData.map((row, i) => {
                const prevCashFlow = i === 0 ? -Infinity : results.cashFlowData[i - 1].cashFlow
                const isBreakEven = row.cashFlow >= 0 && prevCashFlow < 0
                return (
                  <tr key={row.month} className={isBreakEven ? 'break-even-row' : ''}>
                    <td>{row.month}</td>
                    <td>{formatCurrency(inputs.monthlyRevenue, currency)}</td>
                    <td>{formatCurrency(inputs.monthlyCosts, currency)}</td>
                    <td className={results.monthlyNetProfit >= 0 ? 'positive' : 'negative'}>
                      {formatCurrency(results.monthlyNetProfit, currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BreakdownTable
