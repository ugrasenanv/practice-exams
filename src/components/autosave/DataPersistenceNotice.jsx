import { useState } from 'react'
import styles from './DataPersistenceNotice.module.css'
import { exportResultsToExcel } from '../../utils/exportResultsToExcel.js'

// Simplified B + C: minimal message + optional detail toggle + export button
export default function DataPersistenceNotice({ className = '' }) {
  const [showDetails, setShowDetails] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setExportError(null)
    setIsExporting(true)
    const started = Date.now()
    try {
      // History-only export: call utility with no current attempt but includeRaw=false
      await exportResultsToExcel({ attempt: null, questions: null, selectedAnswers: null, timingData: null, includeRaw: false })
    } catch (err) {
      console.error('Excel export failed', err)
      setExportError(err.message)
    }
    finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`${styles.notice} ${className}`} data-testid="data-persistence-notice">
      <div className={styles.headerRow}>
        <span className={styles.icon}>🗂️</span>
        <span>Local Progress Notice</span>
      </div>
      <div>
        Your exam progress & results are stored only in this browser. Clearing site data or using private mode will permanently erase them.
        {' '}<button
          type="button"
          className={`${styles.button} ${styles.secondaryButton}`}
          style={{ padding: '0.25rem 0.55rem', fontSize: '0.65rem' }}
          onClick={() => setShowDetails(v => !v)}
          data-testid="data-persistence-details-toggle"
        >{showDetails ? 'Hide details' : 'Why?'}</button>
      </div>
      {showDetails && (
        <div style={{ marginTop: '0.55rem', fontSize: '0.7rem' }} data-testid="data-persistence-details">
          We use <span className={styles.inlineCode}>localStorage</span> for fast, private, per-device persistence (no server). To keep history across devices, export a backup and import manually in another browser.
        </div>
      )}
      <div className={styles.actions} style={{ marginTop: '0.55rem' }}>
        <button className={styles.button} type="button" onClick={handleExport} data-testid="data-persistence-export" disabled={isExporting} data-exporting={isExporting || undefined}>📊 {isExporting ? 'Exporting...' : 'Export History (Excel)'}</button>
      </div>
      {exportError && <div className={styles.feedback} style={{ color: '#b20000' }}>Export failed: {exportError}</div>}
    </div>
  )
}
