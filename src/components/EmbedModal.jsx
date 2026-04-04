import { useRef, useState } from 'react'

export default function EmbedModal({ onClose }) {
  const textRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const origin = window.location.origin + window.location.pathname.replace(/\/$/, '')
  const code =
    `<iframe\n` +
    `  src="${origin}"\n` +
    `  width="1200"\n` +
    `  height="900"\n` +
    `  frameborder="0"\n` +
    `  title="ROI Calculator"\n` +
    `  allow="clipboard-write"\n` +
    `></iframe>`

  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {
      textRef.current.select()
      document.execCommand('copy')
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="embed-title">
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="embed-title">Embed Calculator</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p className="modal-desc">
          Copy the snippet below to embed this calculator on any website.
        </p>
        <textarea
          ref={textRef}
          className="embed-code"
          readOnly
          value={code}
          rows={7}
          aria-label="Embed code snippet"
          onClick={e => e.target.select()}
        />
        <div className="modal-footer">
          <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
