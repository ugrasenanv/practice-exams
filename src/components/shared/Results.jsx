import { useMemo, useState } from 'react'
import styles from './Results.module.css'
import DataPersistenceNotice from '../autosave/DataPersistenceNotice.jsx'
import { exportResultsToExcel } from '../../utils/exportResultsToExcel.js'

export default function Results({
  title = 'Exam Results',
  questions,
  selectedAnswers,
  totalTimeSec,
  timeLimitSec = 5400,
  passThreshold = 77,
  onGoHome,
  onStudyMore,
  onRetakeIncorrect,
}) {
  const [showDetails, setShowDetails] = useState(false)

  const attempt = useMemo(() => {
    const total = questions.length
    let correct = 0
    const incorrectQuestions = []
    const domainResults = {}
    
    const perQuestion = questions.map(q => {
      const selected = selectedAnswers[q.id]
      let isCorrect = false
      let questionScore = 0
      let selectedAnswerText = ''
      let correctAnswerText = ''

      if (q.questionType === 'multiple') {
        // Multi-select question handling
        const userSelections = selected || []
        const correctAnswers = q.correctAnswers || []
        
        if (userSelections.length > 0) {
          const correctSelected = userSelections.filter(idx => correctAnswers.includes(idx)).length
          const incorrectSelected = userSelections.filter(idx => !correctAnswers.includes(idx)).length
          
          // Calculate question score (0 to 1)
          questionScore = Math.max(0, (correctSelected - incorrectSelected) / correctAnswers.length)
          isCorrect = questionScore >= 1.0
        }
        
        // Format selected answers
        if (userSelections.length > 0) {
          selectedAnswerText = userSelections.map(idx => `${String.fromCharCode(65 + idx)}. ${q.options[idx]}`).join(', ')
        } else {
          selectedAnswerText = 'Not answered'
        }
        
        // Format correct answers
        correctAnswerText = correctAnswers.map(idx => `${String.fromCharCode(65 + idx)}. ${q.options[idx]}`).join(', ')
      } else {
        // Single-select question handling (existing logic)
        isCorrect = selected === q.correctAnswer
        questionScore = isCorrect ? 1 : 0
        selectedAnswerText = selected !== undefined ? `${String.fromCharCode(65 + selected)}. ${q.options[selected]}` : 'Not answered'
        correctAnswerText = `${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}`
      }

      correct += questionScore
      
      if (questionScore < 1.0) {
        incorrectQuestions.push(q)
      }

      // Track domain performance
      if (!domainResults[q.domain]) {
        domainResults[q.domain] = { correct: 0, total: 0 }
      }
      domainResults[q.domain].total += 1
      domainResults[q.domain].correct += questionScore

      return {
        question: q,
        selected,
        isCorrect,
        questionScore,
        selectedAnswer: selectedAnswerText,
        correctAnswer: correctAnswerText
      }
    })

  // Round aggregate correct to 2 decimals for partial credit visibility while avoiding long floats
  const roundedCorrect = Math.round(correct * 100) / 100
  const score = Math.round((roundedCorrect / total) * 100)
    const passed = score >= passThreshold
    const timeUsed = totalTimeSec
    const timeUsedFormatted = formatTime(timeUsed)

    return {
      total,
  correct: roundedCorrect,
  incorrect: Math.round((total - correct) * 100) / 100,
      score,
      passed,
      timeUsed,
      timeUsedFormatted,
      perQuestion,
      incorrectQuestions,
      domainResults
    }
  }, [questions, selectedAnswers, passThreshold, totalTimeSec])

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.resultsContainer}>
      <header className={styles.resultsHeader}>
        <div className={styles.resultsHeaderContent}>
          <div className={styles.brand}>
            <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
            <div className={styles.tagline}>Practice Exam Results</div>
          </div>
          <button onClick={onGoHome} className={styles.homeButton}>
            ← Back to Home
          </button>
        </div>
      </header>

      <main className={styles.resultsContent}>
        <div className={styles.resultsCard}>
          <div className={styles.scoreSection}>
            <h1>{title}</h1>
            
            <div className={styles.scoreDisplay}>
              <div className={`${styles.scoreCircle} ${attempt.passed ? styles.passed : styles.failed}`} data-testid="results-score-circle">
                <div className={styles.scoreNumber} data-testid="results-score">{attempt.score}%</div>
                <div className={styles.scoreLabel} data-testid="results-pass-status">
                  {attempt.passed ? 'PASSED' : 'FAILED'}
                </div>
              </div>
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.scoreItem} data-testid="results-correct">
                <span className={styles.scoreValue}>{Number(attempt.correct.toFixed(2))}</span>
                <span className={styles.scoreText}>Correct</span>
              </div>
              <div className={styles.scoreItem} data-testid="results-incorrect">
                <span className={styles.scoreValue}>{Number(attempt.incorrect.toFixed(2))}</span>
                <span className={styles.scoreText}>Incorrect</span>
              </div>
              <div className={styles.scoreItem} data-testid="results-total">
                <span className={styles.scoreValue}>{attempt.total}</span>
                <span className={styles.scoreText}>Total</span>
              </div>
              <div className={styles.scoreItem} data-testid="results-time-used">
                <span className={styles.scoreValue}>{attempt.timeUsedFormatted}</span>
                <span className={styles.scoreText}>Time Used</span>
              </div>
            </div>
          </div>

          <div className={styles.domainSection}>
            <h2>Performance by Domain</h2>
            <div className={styles.domainGrid}>
              {Object.entries(attempt.domainResults).map(([domain, result]) => {
                const percentage = Math.round((result.correct / result.total) * 100)
                return (
                  <div key={domain} className={styles.domainCard}>
                    <h3>{domain}</h3>
                    <div className={styles.domainScore}>
                      <span className={styles.domainPercentage}>{percentage}%</span>
                      <span className={styles.domainFraction}>
                        ({(Math.round(result.correct * 100) / 100).toFixed(2)}/{result.total})
                      </span>
                    </div>
                    <div className={styles.domainBar}>
                      <div 
                        className={styles.domainFill}
                        style={{ 
                          width: `${percentage}%`,
                          background: percentage >= passThreshold ? 'var(--success-color)' : 'var(--danger-color)'
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.actionsSection}>
            <h2>What's Next?</h2>
            <div className={styles.actionButtons}>
              <button onClick={onStudyMore} className={styles.actionButton}>
                📚 Study Materials
              </button>
              {attempt.incorrectQuestions.length > 0 && (
                <button 
                  onClick={() => onRetakeIncorrect(attempt.incorrectQuestions.map(q => q.id))} 
                  className={styles.actionButton}
                >
                  🔄 Retake Exam
                </button>
              )}
              <button onClick={onGoHome} className={styles.actionButton}>
                🏠 Back to Home
              </button>
              <button 
                onClick={() => {
                  exportResultsToExcel({
                    attempt: { ...attempt, title },
                    questions,
                    selectedAnswers,
                    timingData: null,
                    includeRaw: false
                  })
                }}
                className={styles.actionButton}
                data-testid="results-export-excel"
              >
                📊 Export Excel
              </button>
            </div>

            <button 
              onClick={() => setShowDetails(!showDetails)}
              className={styles.detailsToggle}
            >
              {showDetails ? '▲' : '▼'} {showDetails ? 'Hide' : 'Show'} Detailed Results
            </button>
          </div>

          {showDetails && (
            <div className={styles.detailsSection}>
              <h3>Question-by-Question Results</h3>
              <div className={styles.questionResults}>
                {attempt.perQuestion.map((result, index) => (
                  <div 
                    key={result.question.id} 
                    className={`${styles.questionResult} ${result.isCorrect ? styles.correct : styles.incorrect}`}
                  >
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>Q{index + 1}</span>
                      <span className={`${styles.resultIcon} ${result.isCorrect ? styles.correctIcon : styles.incorrectIcon}`}>
                        {result.isCorrect ? '✓' : result.questionScore > 0 ? '◐' : '✗'}
                      </span>
                      {result.question.questionType === 'multiple' && result.questionScore < 1 && result.questionScore > 0 && (
                        <span className={styles.partialCredit}>
                          {Math.round(result.questionScore * 100)}%
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.questionContent}>
                      <p className={styles.questionText}>{result.question.question}</p>
                      
                      <div className={styles.answerComparison}>
                        <div className={styles.answerItem}>
                          <span className={styles.answerLabel}>Your answer:</span>
                          <span className={`${styles.answerText} ${!result.isCorrect ? styles.wrongAnswer : ''}`}>
                            {result.selectedAnswer}
                          </span>
                        </div>
                        
                        {!result.isCorrect && (
                          <div className={styles.answerItem}>
                            <span className={styles.answerLabel}>Correct answer:</span>
                            <span className={`${styles.answerText} ${styles.rightAnswer}`}>
                              {result.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.explanation}>
                        <h4>Explanation:</h4>
                        <p>{result.question.explanation}</p>
                      </div>

                      <div className={styles.questionMeta}>
                        <span className={styles.domain}>{result.question.domain}</span>
                        <span className={styles.difficulty}>{result.question.difficulty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Persistence notice also relevant post-exam for exporting current results */}
          <DataPersistenceNotice className={styles.persistenceNotice} />
        </div>
      </main>
    </div>
  )
}