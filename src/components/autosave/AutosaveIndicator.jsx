import { useAutosave } from '../../contexts/AutosaveContext.jsx'
import styles from './AutosaveIndicator.module.css'

const AutosaveIndicator = ({ position = 'top-right' }) => {
  const { autosaveStatus, lastSavedTime, formatSaveTime, isEnabled } = useAutosave()

  if (!isEnabled) return null

  const getStatusIcon = () => {
    switch (autosaveStatus) {
      case 'saving':
        return '💾'
      case 'saved':
        return '✅'
      case 'error':
        return '⚠️'
      default:
        return '💾'
    }
  }

  const getStatusText = () => {
    switch (autosaveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return `Saved ${formatSaveTime(lastSavedTime)}`
      case 'error':
        return 'Save failed'
      default:
        return lastSavedTime ? `Last saved ${formatSaveTime(lastSavedTime)}` : 'Autosave ready'
    }
  }

  const getStatusClass = () => {
    let baseClass = styles.indicator
    
    switch (autosaveStatus) {
      case 'saving':
        baseClass += ` ${styles.saving}`
        break
      case 'saved':
        baseClass += ` ${styles.saved}`
        break
      case 'error':
        baseClass += ` ${styles.error}`
        break
      default:
        baseClass += ` ${styles.idle}`
        break
    }

    // Add position class
    baseClass += ` ${styles[position.replace('-', '_')]}`
    
    return baseClass
  }

  return (
    <div className={getStatusClass()}>
      <div className={styles.content}>
        <span className={styles.icon}>{getStatusIcon()}</span>
        <span className={styles.text}>{getStatusText()}</span>
      </div>
      {autosaveStatus === 'saving' && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      )}
    </div>
  )
}

export default AutosaveIndicator