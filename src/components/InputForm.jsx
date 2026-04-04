function InputForm({ label, inputs, onChange, colorClass, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(prev => ({
      ...prev,
      [name]: name === 'period' ? parseInt(value) : parseFloat(value) || 0,
    }))
  }

  return (
    <div className={`card ${colorClass}`}>
      <h2>{label}</h2>
      <div className={`form-group ${errors.initialInvestment ? 'has-error' : ''}`}>
        <label htmlFor={`${label}-initialInvestment`}>Initial Investment ($)</label>
        <input id={`${label}-initialInvestment`} type="number" name="initialInvestment" value={inputs.initialInvestment} onChange={handleChange} min="0" />
        {errors.initialInvestment && <span className="error-msg">{errors.initialInvestment}</span>}
      </div>
      <div className={`form-group ${errors.monthlyRevenue ? 'has-error' : ''}`}>
        <label htmlFor={`${label}-monthlyRevenue`}>Expected Monthly Revenue ($)</label>
        <input id={`${label}-monthlyRevenue`} type="number" name="monthlyRevenue" value={inputs.monthlyRevenue} onChange={handleChange} min="0" />
        {errors.monthlyRevenue && <span className="error-msg">{errors.monthlyRevenue}</span>}
      </div>
      <div className={`form-group ${errors.monthlyCosts ? 'has-error' : ''}`}>
        <label htmlFor={`${label}-monthlyCosts`}>Monthly Operating Costs ($)</label>
        <input id={`${label}-monthlyCosts`} type="number" name="monthlyCosts" value={inputs.monthlyCosts} onChange={handleChange} min="0" />
        {errors.monthlyCosts && <span className="error-msg">{errors.monthlyCosts}</span>}
      </div>
      <div className="form-group">
        <label htmlFor={`${label}-period`}>Calculation Period (months)</label>
        <select id={`${label}-period`} name="period" value={inputs.period} onChange={handleChange}>
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>
    </div>
  )
}

export default InputForm
