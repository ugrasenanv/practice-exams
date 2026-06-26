import { useState, useEffect } from 'react'
import { useAutosave } from '../../contexts/AutosaveContext.jsx'
import styles from './SessionRecovery.module.css'

const SessionRecovery = ({ examType, onRestore, onDismiss }) => {
  const { getAutosavedSessions, clearExamState, formatSaveTime } = useAutosave()
  const [availableSessions, setAvailableSessions] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const sessions = getAutosavedSessions()
    const relevantSessions = sessions.filter(session => 
      session.examType === examType && session.answeredCount > 0
    )
    
    if (relevantSessions.length > 0) {
      setAvailableSessions(relevantSessions)
      setIsVisible(true)
    }
  }, [examType, getAutosavedSessions])

  const handleRestore = (session) => {
    onRestore(session)
    setIsVisible(false)
  }

  const handleDismiss = (session) => {
    clearExamState(session.examType, session.sessionId)
    setAvailableSessions(prev => 
      prev.filter(s => s.sessionId !== session.sessionId)
    )
    
    if (availableSessions.length === 1) {
      setIsVisible(false)
      onDismiss()
    }
  }

  const handleDismissAll = () => {
    availableSessions.forEach(session => {
      clearExamState(session.examType, session.sessionId)
    })
    setIsVisible(false)
    onDismiss()
  }

  if (!isVisible || availableSessions.length === 0) {
    return null
  }

  const formatExamType = (type) => {
    switch (type) {
      case 'leadingsafe6':
        return 'Leading SAFe 6'
      case 'safeteams6':
        return 'SAFe for Teams 6.0'
      default:
        return type
    }
  }

  return (
    <div className={styles.overlay} data-testid="session-recovery-overlay">
      <div className={styles.modal} data-testid="session-recovery-modal">
        <div className={styles.header}>
          <h2>🔄 Recover Previous Session</h2>
          <p>We found {availableSessions.length} unfinished exam session{availableSessions.length > 1 ? 's' : ''} that you can continue.</p>
        </div>

        <div className={styles.sessionsList}>
          {availableSessions.map((session, index) => (
            <div key={session.sessionId} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <div className={styles.sessionTitle}>
                  <span className={styles.examIcon}>📋</span>
                  <div>
                    <h3>{formatExamType(session.examType)}</h3>
                    <p className={styles.sessionTime}>
                      Last saved {formatSaveTime(session.lastSaved)}
                    </p>
                  </div>
                </div>
                <div className={styles.sessionProgress}>
                  <div className={styles.progressRing}>
                    <svg className={styles.progressSvg} viewBox="0 0 36 36">
                      <path
                        className={styles.progressBackground}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={styles.progressBar}
                        strokeDasharray={`${(session.answeredCount / session.totalQuestions) * 100}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className={styles.progressText}>
                      {Math.round((session.answeredCount / session.totalQuestions) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sessionDetails}>
                <div className={styles.sessionStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>📝</span>
                    <span className={styles.statText}>
                      {session.answeredCount} / {session.totalQuestions} answered
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>📍</span>
                    <span className={styles.statText}>
                      Question {session.progress + 1} of {session.totalQuestions}
                    </span>
                  </div>
                </div>

                <div className={styles.sessionActions}>
                  <button
                    className={`${styles.actionButton} ${styles.restore}`}
                    data-testid={`session-recovery-continue-${index}`}
                    onClick={() => handleRestore(session)}
                  >
                    <span className={styles.buttonIcon}>▶️</span>
                    Continue Session
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.dismiss}`}
                    data-testid={`session-recovery-delete-${index}`}
                    onClick={() => handleDismiss(session)}
                  >
                    <span className={styles.buttonIcon}>🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <p>💡 Your progress is automatically saved every 30 seconds during exams.</p>
          </div>
          <div className={styles.footerActions}>
            <button
              className={`${styles.footerButton} ${styles.dismissAll}`}
              data-testid="session-recovery-dismiss-all"
              onClick={handleDismissAll}
            >
              Start Fresh (Delete All)
            </button>
            <button
              className={`${styles.footerButton} ${styles.close}`}
              data-testid="session-recovery-close"
              onClick={() => {
                setIsVisible(false)
                onDismiss()
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionRecovery