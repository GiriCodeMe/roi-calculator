import { describe, it, expect } from 'vitest'
import { CURRENCIES, formatCurrency, getCurrencySymbol } from '../utils/currency'

describe('CURRENCIES', () => {
  it('has 3 entries', () => {
    expect(CURRENCIES).toHaveLength(3)
  })

  it('each entry has code, symbol, and locale', () => {
    for (const c of CURRENCIES) {
      expect(c).toHaveProperty('code')
      expect(c).toHaveProperty('symbol')
      expect(c).toHaveProperty('locale')
    }
  })

  it('contains USD, EUR, RUB', () => {
    const codes = CURRENCIES.map(c => c.code)
    expect(codes).toContain('USD')
    expect(codes).toContain('EUR')
    expect(codes).toContain('RUB')
  })
})

describe('formatCurrency', () => {
  it('formats USD positive value', () => {
    expect(formatCurrency(20000, 'USD')).toContain('20,000')
  })

  it('formats USD negative value', () => {
    expect(formatCurrency(-5000, 'USD')).toContain('5,000')
  })

  it('formats EUR — contains €', () => {
    expect(formatCurrency(10000, 'EUR')).toContain('€')
  })

  it('formats RUB — contains ₽', () => {
    expect(formatCurrency(10000, 'RUB')).toContain('₽')
  })

  it('rounds fractional values', () => {
    const result = formatCurrency(1000.7, 'USD')
    expect(result).toContain('1,001')
  })

  it('falls back to USD for unknown currency code', () => {
    expect(formatCurrency(1000, 'XYZ')).toContain('1,000')
  })
})

describe('getCurrencySymbol', () => {
  it('returns $ for USD', () => {
    expect(getCurrencySymbol('USD')).toBe('$')
  })

  it('returns € for EUR', () => {
    expect(getCurrencySymbol('EUR')).toBe('€')
  })

  it('returns ₽ for RUB', () => {
    expect(getCurrencySymbol('RUB')).toBe('₽')
  })

  it('falls back to $ for unknown code', () => {
    expect(getCurrencySymbol('XYZ')).toBe('$')
  })
})
