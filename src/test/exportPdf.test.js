import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Hoisted mock state (must be declared before vi.mock factories) ────────────
const {
  fakeCanvas,
  mockSave, mockText, mockAddImage, mockLine,
  mockSetFont, mockSetFontSize, mockSetTextColor,
  mockSetDrawColor, mockSetLineWidth,
} = vi.hoisted(() => {
  const fakeCanvas = {
    width: 800,
    height: 600,
    toDataURL: vi.fn(() => 'data:image/png;base64,fake'),
  }
  return {
    fakeCanvas,
    mockSave:         vi.fn(),
    mockText:         vi.fn(),
    mockAddImage:     vi.fn(),
    mockLine:         vi.fn(),
    mockSetFont:      vi.fn(),
    mockSetFontSize:  vi.fn(),
    mockSetTextColor: vi.fn(),
    mockSetDrawColor: vi.fn(),
    mockSetLineWidth: vi.fn(),
  }
})

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue(fakeCanvas),
}))

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(function() {
    this.internal    = { pageSize: { getWidth: () => 210, getHeight: () => 297 } }
    this.setFont     = mockSetFont
    this.setFontSize = mockSetFontSize
    this.setTextColor = mockSetTextColor
    this.setDrawColor = mockSetDrawColor
    this.setLineWidth = mockSetLineWidth
    this.text        = mockText
    this.line        = mockLine
    this.addImage    = mockAddImage
    this.save        = mockSave
  }),
}))

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { exportToPDF } from '../utils/exportPdf'

describe('exportToPDF', () => {
  const fakeElement = document.createElement('div')

  beforeEach(() => {
    vi.clearAllMocks()
    fakeCanvas.toDataURL.mockReturnValue('data:image/png;base64,fake')
  })

  it('calls html2canvas with the provided element', async () => {
    await exportToPDF(fakeElement)
    expect(html2canvas).toHaveBeenCalledWith(fakeElement, expect.objectContaining({ scale: 1.5 }))
  })

  it('creates a jsPDF instance with A4 portrait config', async () => {
    await exportToPDF(fakeElement)
    expect(jsPDF).toHaveBeenCalledWith(expect.objectContaining({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    }))
  })

  it('writes the "ROI Analysis Report" title', async () => {
    await exportToPDF(fakeElement)
    expect(mockText).toHaveBeenCalledWith('ROI Analysis Report', expect.any(Number), expect.any(Number))
  })

  it('writes a Generated date string', async () => {
    await exportToPDF(fakeElement)
    const textCalls = mockText.mock.calls.map(c => c[0])
    expect(textCalls.some(t => t.startsWith('Generated:'))).toBe(true)
  })

  it('adds the canvas image to the PDF', async () => {
    await exportToPDF(fakeElement)
    expect(mockAddImage).toHaveBeenCalledWith(
      'data:image/png;base64,fake',
      'PNG',
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    )
  })

  it('saves the PDF with a date-stamped filename', async () => {
    await exportToPDF(fakeElement)
    expect(mockSave).toHaveBeenCalledTimes(1)
    expect(mockSave.mock.calls[0][0]).toMatch(/^roi-analysis-\d{4}-\d{2}-\d{2}\.pdf$/)
  })
})
