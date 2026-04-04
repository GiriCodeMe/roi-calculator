import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(element) {
  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    logging: false,
  })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentW = pageW - margin * 2

  // ── Header ──────────────────────────────────────────────────────────────────
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(20)
  pdf.setTextColor(37, 99, 235)
  pdf.text('ROI Analysis Report', margin, 18)

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(71, 85, 105)
  pdf.text(`Generated: ${dateStr}`, margin, 26)

  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(0.4)
  pdf.line(margin, 30, pageW - margin, 30)

  // ── Screenshot ───────────────────────────────────────────────────────────────
  const headerH = 36
  const maxImgH = pageH - headerH - margin
  const naturalH = (canvas.height * contentW) / canvas.width
  const imgH = Math.min(naturalH, maxImgH)

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, headerH, contentW, imgH)

  pdf.save(`roi-analysis-${new Date().toISOString().slice(0, 10)}.pdf`)
}
