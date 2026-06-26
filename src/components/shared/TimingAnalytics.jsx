import { useState, useEffect } from 'react'
import styles from './TimingAnalytics.module.css'

function TimingAnalytics({ onGoHome }) {
  const [timingData, setTimingData] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)

  useEffect(() => {
    // Load all timing data from localStorage
    const loadTimingData = () => {
      const data = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('examTiming_')) {
          try {
            const examData = JSON.parse(localStorage.getItem(key))
            data.push({ ...examData, storageKey: key })
          } catch (error) {
            console.error('Error parsing timing data:', error)
          }
        }
      }      
      
      // Sort by date (newest first)
      data.sort((a, b) => new Date(b.date) - new Date(a.date))
      setTimingData(data)
    }

    loadTimingData()
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${secs}s`
  }

  const formatMilliseconds = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getTimingStats = (exam) => {
    const timings = Object.values(exam.questionTimings || {})
    if (timings.length === 0) return null

    const totalMs = timings.reduce((sum, time) => sum + time, 0)
    const avgMs = totalMs / timings.length
    const maxMs = Math.max(...timings)
    const minMs = Math.min(...timings)

    return {
      totalTime: totalMs,
      avgTime: avgMs,
      maxTime: maxMs,
      minTime: minMs,
      questionCount: timings.length
    }
  }

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all timing data? This cannot be undone.')) {
      timingData.forEach(exam => {
        localStorage.removeItem(exam.storageKey)
      })
      setTimingData([])
      setSelectedExam(null)
    }
  }

  const deleteExam = (storageKey) => {
    if (confirm('Are you sure you want to delete this exam timing data?')) {
      localStorage.removeItem(storageKey)
      setTimingData(prev => prev.filter(exam => exam.storageKey !== storageKey))
      if (selectedExam && selectedExam.storageKey === storageKey) {
        setSelectedExam(null)
      }
    }
  }

  return (
    <div className={styles.examContainer}>
      <header className={styles.examHeader}>
        <div className={styles.brand}>
          <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
          <div className={styles.tagline}>Exam Timing Analytics</div>
        </div>
        <button className={styles.homeButton} onClick={onGoHome}>
          ← Back to Home
        </button>
      </header>

      <main className={styles.examContent}>
        {timingData.length === 0 ? (
          <div className={styles.noData}>
            <h1>Exam Timing Analytics</h1>
            <p>No timing data available yet.</p>
            <p>Complete an exam to see your timing analytics!</p>
          </div>
        ) : (
          <div className={styles.analyticsContainer}>
            <h1>Exam Timing Analytics</h1>
            <div className={styles.examList}>
              <div className={styles.listHeader}>
                <h3>Exam Sessions ({timingData.length})</h3>
                <button onClick={clearAllData} className={styles.clearButton}>
                  Clear All
                </button>
              </div>
                
                {timingData.map((exam, index) => {
                  const stats = getTimingStats(exam)
                  return (
                    <div
                      key={exam.storageKey}
                      className={`${styles.examItem} ${selectedExam?.storageKey === exam.storageKey ? styles.selected : ''}`}
                      onClick={() => setSelectedExam(exam)}
                    >
                      <div className={styles.examHeader}>
                        <span className={styles.examType}>{exam.examType}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteExam(exam.storageKey)
                          }}
                          className={styles.deleteButton}
                        >
                          🗑️
                        </button>
                      </div>
                      <div className={styles.examMeta}>
                        <span>{new Date(exam.date).toLocaleDateString()}</span>
                        <span>{new Date(exam.date).toLocaleTimeString()}</span>
                      </div>
                      {stats && (
                        <div className={styles.examStats}>
                          <span>Total: {formatTime(exam.totalTimeUsed)}</span>
                          <span>Avg/Q: {formatMilliseconds(stats.avgTime)}</span>
                          <span>Questions: {stats.questionCount}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {selectedExam && (
                <div className={styles.examDetails}>
                  <h3>{selectedExam.examType} - Detailed Analysis</h3>
                  <div className={styles.examInfo}>
                    <div className={styles.infoItem}>
                      <strong>Date:</strong> {new Date(selectedExam.date).toLocaleString()}
                    </div>
                    <div className={styles.infoItem}>
                      <strong>Total Exam Time:</strong> {formatTime(selectedExam.totalTimeUsed)}
                    </div>
                    <div className={styles.infoItem}>
                      <strong>Questions Tracked:</strong> {Object.keys(selectedExam.questionTimings || {}).length}
                    </div>
                  </div>

                  {(() => {
                    const stats = getTimingStats(selectedExam)
                    if (!stats) return <p>No question timing data available for this exam.</p>

                    return (
                      <div className={styles.timingStats}>
                        <h4>Question Timing Statistics</h4>
                        <div className={styles.statsGrid}>
                          <div className={styles.statItem}>
                            <span className={styles.statLabel}>Average Time per Question:</span>
                            <span className={styles.statValue}>{formatMilliseconds(stats.avgTime)}</span>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statLabel}>Fastest Question:</span>
                            <span className={styles.statValue}>{formatMilliseconds(stats.minTime)}</span>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statLabel}>Slowest Question:</span>
                            <span className={styles.statValue}>{formatMilliseconds(stats.maxTime)}</span>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statLabel}>Total Question Time:</span>
                            <span className={styles.statValue}>{formatMilliseconds(stats.totalTime)}</span>
                          </div>
                        </div>

                        <h4>Per-Question Breakdown</h4>
                        <div className={styles.questionList}>
                          {selectedExam.questions?.map((question, index) => {
                            const timeSpent = selectedExam.questionTimings[question.id] || 0
                            return (
                              <div key={question.id} className={styles.questionItem}>
                                <div className={styles.questionInfo}>
                                  <span className={styles.questionNumber}>Q{index + 1}</span>
                                  <span className={styles.questionText}>{question.question}</span>
                                  <span className={styles.questionDomain}>{question.domain}</span>
                                </div>
                                <div className={styles.questionTime}>
                                  {formatMilliseconds(timeSpent)}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
      </main>
    </div>
  )
}

export default TimingAnalytics