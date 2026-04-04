const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US')
const fmtPct = (n) => n.toFixed(1) + '%'

function Results({ label, results, inputs, colorClass, disabled }) {
  if (disabled) {
    return (
      <div className={`card ${colorClass} results-disabled`}>
        <h2>{label} — Results</h2>
        <p className="disabled-msg">Fix the errors above to see results</p>
      </div>
    )
  }

  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = results

  const paybackLabel =
    paybackPeriod === null
      ? 'Never'
      : paybackPeriod > inputs.period
      ? `${paybackPeriod} mo (beyond period)`
      : `${paybackPeriod} months`

  return (
    <div className={`card ${colorClass}`}>
      <h2>{label} — Results</h2>
      <div className="results-grid">
        <div className="result-item">
          <div className="result-label">ROI</div>
          <div className={`result-value ${roi >= 0 ? 'positive' : 'negative'}`}>
            {fmtPct(roi)}
          </div>
        </div>
        <div className="result-item">
          <div className="result-label">Payback Period</div>
          <div className="result-value">{paybackLabel}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Total Net Profit</div>
          <div className={`result-value ${totalNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {fmt(totalNetProfit)}
          </div>
        </div>
        <div className="result-item">
          <div className="result-label">Monthly Net Profit</div>
          <div className={`result-value ${monthlyNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {fmt(monthlyNetProfit)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
