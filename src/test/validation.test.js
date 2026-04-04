import { describe, it, expect } from 'vitest'
import { validateInputs, hasErrors } from '../utils/validation'

const valid = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000 }

describe('validateInputs', () => {
  it('returns empty errors for valid inputs', () => {
    expect(validateInputs(valid)).toEqual({})
  })

  it('returns error when initialInvestment is 0', () => {
    expect(validateInputs({ ...valid, initialInvestment: 0 })).toHaveProperty('initialInvestment')
  })

  it('returns error when initialInvestment is negative', () => {
    expect(validateInputs({ ...valid, initialInvestment: -1 })).toHaveProperty('initialInvestment')
  })

  it('returns error when monthlyRevenue is 0', () => {
    expect(validateInputs({ ...valid, monthlyRevenue: 0 })).toHaveProperty('monthlyRevenue')
  })

  it('returns error when monthlyRevenue is negative', () => {
    expect(validateInputs({ ...valid, monthlyRevenue: -500 })).toHaveProperty('monthlyRevenue')
  })

  it('returns error when monthlyCosts is 0', () => {
    expect(validateInputs({ ...valid, monthlyCosts: 0 })).toHaveProperty('monthlyCosts')
  })

  it('returns error when monthlyCosts is negative', () => {
    expect(validateInputs({ ...valid, monthlyCosts: -100 })).toHaveProperty('monthlyCosts')
  })

  it('returns multiple errors when multiple fields are invalid', () => {
    const errors = validateInputs({ initialInvestment: 0, monthlyRevenue: 0, monthlyCosts: 0 })
    expect(Object.keys(errors)).toHaveLength(3)
  })

  it('error messages are non-empty strings', () => {
    const errors = validateInputs({ ...valid, initialInvestment: 0 })
    expect(typeof errors.initialInvestment).toBe('string')
    expect(errors.initialInvestment.length).toBeGreaterThan(0)
  })
})

describe('hasErrors', () => {
  it('returns false for empty errors object', () => {
    expect(hasErrors({})).toBe(false)
  })

  it('returns true when errors object has keys', () => {
    expect(hasErrors({ initialInvestment: 'Must be greater than $0' })).toBe(true)
  })
})
