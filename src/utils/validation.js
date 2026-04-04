export function validateInputs({ initialInvestment, monthlyRevenue, monthlyCosts }) {
  const errors = {}
  if (!initialInvestment || initialInvestment <= 0)
    errors.initialInvestment = 'Must be greater than $0'
  if (!monthlyRevenue || monthlyRevenue <= 0)
    errors.monthlyRevenue = 'Must be greater than $0'
  if (!monthlyCosts || monthlyCosts <= 0)
    errors.monthlyCosts = 'Must be greater than $0'
  return errors
}

export const hasErrors = (errors) => Object.keys(errors).length > 0
