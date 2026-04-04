import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CashFlowChart, { makeFormatY, makeFormatTooltip, formatLabel } from '../components/CashFlowChart'
import { calculateROI } from '../utils/calculations'

vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey, isAnimationActive, animationDuration, animationEasing, animationBegin }) => (
    <div
      data-testid={`line-${dataKey}`}
      data-animation-active={String(isAnimationActive)}
      data-animation-duration={String(animationDuration)}
      data-animation-easing={animationEasing}
      data-animation-begin={String(animationBegin)}
    />
  ),
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ReferenceLine: ({ y }) => <div data-testid="reference-line" data-y={String(y)} />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="chart-legend" />,
}))

const inputs = { initialInvestment: 100000, monthlyRevenue: 15000, monthlyCosts: 5000, period: 12 }
const dataA = calculateROI(inputs).cashFlowData
const dataB = calculateROI({ ...inputs, initialInvestment: 150000 }).cashFlowData

describe('makeFormatY', () => {
  it('formats thousands as $Xk for USD', () => {
    const formatY = makeFormatY('USD')
    expect(formatY(10000)).toBe('$10k')
    expect(formatY(-5000)).toBe('$-5k')
    expect(formatY(0)).toBe('$0k')
  })

  it('uses € for EUR', () => {
    const formatY = makeFormatY('EUR')
    expect(formatY(10000)).toContain('€')
  })

  it('uses ₽ for RUB', () => {
    const formatY = makeFormatY('RUB')
    expect(formatY(10000)).toContain('₽')
  })
})

describe('makeFormatTooltip', () => {
  it('returns formatted currency and name for USD', () => {
    const formatTooltip = makeFormatTooltip('USD')
    const [val, name] = formatTooltip(12345, 'Scenario A')
    expect(val).toContain('12,345')
    expect(name).toBe('Scenario A')
  })

  it('returns € formatted value for EUR', () => {
    const formatTooltip = makeFormatTooltip('EUR')
    const [val] = formatTooltip(5000, 'Scenario B')
    expect(val).toContain('€')
  })
})

describe('formatLabel', () => {
  it('returns "Month N" string', () => {
    expect(formatLabel(1)).toBe('Month 1')
    expect(formatLabel(12)).toBe('Month 12')
  })
})

describe('CashFlowChart', () => {
  it('renders the chart heading', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    expect(screen.getByText('Cumulative Cash Flow')).toBeInTheDocument()
  })

  it('renders the chart when both scenarios are valid', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders Scenario A line when only A is valid', () => {
    render(<CashFlowChart dataA={dataA} dataB={[]} validA validB={false} />)
    expect(screen.getByTestId('line-Scenario A')).toBeInTheDocument()
    expect(screen.queryByTestId('line-Scenario B')).not.toBeInTheDocument()
  })

  it('renders Scenario B line when only B is valid', () => {
    render(<CashFlowChart dataA={[]} dataB={dataB} validA={false} validB />)
    expect(screen.getByTestId('line-Scenario B')).toBeInTheDocument()
    expect(screen.queryByTestId('line-Scenario A')).not.toBeInTheDocument()
  })

  it('shows disabled message when both scenarios are invalid', () => {
    render(<CashFlowChart dataA={[]} dataB={[]} validA={false} validB={false} />)
    expect(screen.getByText(/Fix the errors above/i)).toBeInTheDocument()
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument()
  })

  it('renders chart in dark mode without errors', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB darkMode />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('handles mismatched periods — pads shorter scenario with null (triggers ?? null)', () => {
    const shortData = calculateROI({ ...inputs, period: 6 }).cashFlowData   // 6 months
    const longData  = calculateROI({ ...inputs, period: 12 }).cashFlowData  // 12 months
    render(<CashFlowChart dataA={shortData} dataB={longData} validA validB />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })
})

describe('Chart animation props', () => {
  it('Scenario A line has animation enabled with 600ms ease-out', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    const line = screen.getByTestId('line-Scenario A')
    expect(line).toHaveAttribute('data-animation-active', 'true')
    expect(line).toHaveAttribute('data-animation-duration', '600')
    expect(line).toHaveAttribute('data-animation-easing', 'ease-out')
    expect(line).toHaveAttribute('data-animation-begin', '0')
  })

  it('Scenario B line has animation enabled with 600ms ease-out', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    const line = screen.getByTestId('line-Scenario B')
    expect(line).toHaveAttribute('data-animation-active', 'true')
    expect(line).toHaveAttribute('data-animation-duration', '600')
    expect(line).toHaveAttribute('data-animation-easing', 'ease-out')
    expect(line).toHaveAttribute('data-animation-begin', '0')
  })
})

describe('Break-even reference line', () => {
  it('renders a ReferenceLine at y=0', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    expect(screen.getByTestId('reference-line')).toHaveAttribute('data-y', '0')
  })
})

describe('Chart legend', () => {
  it('renders the chart legend', () => {
    render(<CashFlowChart dataA={dataA} dataB={dataB} validA validB />)
    expect(screen.getByTestId('chart-legend')).toBeInTheDocument()
  })
})
