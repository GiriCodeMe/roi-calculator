function InputForm({ inputs, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(prev => ({
      ...prev,
      [name]: name === 'period' ? parseInt(value) : parseFloat(value) || 0,
    }))
  }

  return (
    <div className="card">
      <h2>Investment Parameters</h2>
      <div className="form-group">
        <label>Initial Investment ($)</label>
        <input type="number" name="initialInvestment" value={inputs.initialInvestment} onChange={handleChange} min="0" />
      </div>
      <div className="form-group">
        <label>Expected Monthly Revenue ($)</label>
        <input type="number" name="monthlyRevenue" value={inputs.monthlyRevenue} onChange={handleChange} min="0" />
      </div>
      <div className="form-group">
        <label>Monthly Operating Costs ($)</label>
        <input type="number" name="monthlyCosts" value={inputs.monthlyCosts} onChange={handleChange} min="0" />
      </div>
      <div className="form-group">
        <label>Calculation Period (months)</label>
        <select name="period" value={inputs.period} onChange={handleChange}>
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>
    </div>
  )
}

export default InputForm
