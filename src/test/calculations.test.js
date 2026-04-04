import { describe, it, expect } from 'vitest'
import { calculateROI } from '../utils/calculations'

const base = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }

describe('calculateROI', () => {
  describe('monthlyNetProfit', () => {
    it('computes revenue minus costs', () => {
      expect(calculateROI(base).monthlyNetProfit).toBe(10000)
    })

    it('is negative when costs exceed revenue', () => {
      expect(calculateROI({ ...base, monthlyCosts: 20000 }).monthlyNetProfit).toBe(-5000)
    })
  })

  describe('totalNetProfit', () => {
    it('equals (monthly net * period) - initial investment', () => {
      // 10000 * 12 - 100000 = 20000
      expect(calculateROI(base).totalNetProfit).toBe(20000)
    })

    it('is negative when investment is not recovered in the period', () => {
      // 10000 * 6 - 100000 = -40000
      expect(calculateROI({ ...base, period: 6 }).totalNetProfit).toBe(-40000)
    })
  })

  describe('roi', () => {
    it('is (totalNetProfit / initialInvestment) * 100', () => {
      // 20000 / 100000 * 100 = 20%
      expect(calculateROI(base).roi).toBeCloseTo(20)
    })

    it('is 0 when initialInvestment is 0', () => {
      expect(calculateROI({ ...base, initialInvestment: 0 }).roi).toBe(0)
    })

    it('is negative when investment is not recovered', () => {
      expect(calculateROI({ ...base, period: 6 }).roi).toBeLessThan(0)
    })
  })

  describe('paybackPeriod', () => {
    it('returns the month when investment is recovered', () => {
      // 100000 / 10000 = 10 months
      expect(calculateROI(base).paybackPeriod).toBe(10)
    })

    it('rounds up (ceil) for non-integer payback', () => {
      // 100000 / 7000 = 14.28... → 15
      expect(calculateROI({ ...base, monthlyRevenue: 12000, monthlyCosts: 5000 }).paybackPeriod).toBe(15)
    })

    it('returns null when monthly net profit is 0', () => {
      expect(calculateROI({ ...base, monthlyRevenue: 5000 }).paybackPeriod).toBeNull()
    })

    it('returns null when monthly net profit is negative', () => {
      expect(calculateROI({ ...base, monthlyCosts: 20000 }).paybackPeriod).toBeNull()
    })
  })

  describe('cashFlowData', () => {
    it('returns one entry per month of the period', () => {
      expect(calculateROI(base).cashFlowData).toHaveLength(12)
      expect(calculateROI({ ...base, period: 24 }).cashFlowData).toHaveLength(24)
    })

    it('month numbers start at 1 and increment by 1', () => {
      const { cashFlowData } = calculateROI(base)
      expect(cashFlowData[0].month).toBe(1)
      expect(cashFlowData[11].month).toBe(12)
    })

    it('first month cash flow is monthlyNet - initialInvestment', () => {
      // 10000 * 1 - 100000 = -90000
      expect(calculateROI(base).cashFlowData[0].cashFlow).toBe(-90000)
    })

    it('cash flow grows by monthlyNetProfit each month', () => {
      const { cashFlowData } = calculateROI(base)
      expect(cashFlowData[1].cashFlow - cashFlowData[0].cashFlow).toBe(10000)
    })

    it('crosses zero at the payback month', () => {
      const { cashFlowData, paybackPeriod } = calculateROI(base)
      expect(cashFlowData[paybackPeriod - 1].cashFlow).toBeGreaterThanOrEqual(0)
      expect(cashFlowData[paybackPeriod - 2].cashFlow).toBeLessThan(0)
    })
  })
})
