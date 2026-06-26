import { useMemo } from 'react'
import styles from './ProgressIndicator.module.css'

const ProgressIndicator = ({ 
  currentQuestion, 
  totalQuestions, 
  answeredQuestions = {},
  bookmarkedQuestions = {},
  showQuestionGrid = true,
  onQuestionClick,
  className = ''
}) => {
  const progressData = useMemo(() => {
    const answeredCount = Object.keys(answeredQuestions).length
    const bookmarkedCount = Object.keys(bookmarkedQuestions).length
    const progressPercent = (answeredCount / totalQuestions) * 100
    
    return {
      answeredCount,
      bookmarkedCount,
      progressPercent,
      remainingCount: totalQuestions - answeredCount
    }
  }, [answeredQuestions, bookmarkedQuestions, totalQuestions])

  return (
    <div className={`${styles.progressContainer} ${className}`}>
      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <div className={styles.progressStats}>
            <span className={styles.currentProgress}>
              {progressData.answeredCount} of {totalQuestions}
            </span>
            <span className={styles.progressPercent}>
              {Math.round(progressData.progressPercent)}% Complete
            </span>
          </div>
        </div>
        
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={progressData.progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${progressData.answeredCount} of ${totalQuestions} questions answered`}
          >
            <div 
              className={styles.progressFill}
              style={{ width: `${progressData.progressPercent}%` }}
            />
          </div>
        </div>
        
        <div className={styles.progressLabels}>
          <div className={styles.progressLabel}>
            <span className={styles.labelIcon}>✓</span>
            <span className={styles.labelText}>
              {progressData.answeredCount} Answered
            </span>
          </div>
          {progressData.bookmarkedCount > 0 && (
            <div className={styles.progressLabel}>
              <span className={styles.labelIcon}>🔖</span>
              <span className={styles.labelText}>
                {progressData.bookmarkedCount} Bookmarked
              </span>
            </div>
          )}
          <div className={styles.progressLabel}>
            <span className={styles.labelIcon}>⏳</span>
            <span className={styles.labelText}>
              {progressData.remainingCount} Remaining
            </span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      {showQuestionGrid && (
        <div className={styles.questionGrid}>
          <div className={styles.gridHeader}>
            <h4 className={styles.gridTitle}>Question Navigator</h4>
            <div className={styles.gridLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.current}`}></div>
                <span>Current</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.answered}`}></div>
                <span>Answered</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.bookmarked}`}></div>
                <span>Bookmarked</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.unanswered}`}></div>
                <span>Unanswered</span>
              </div>
            </div>
          </div>
          
          <div className={styles.gridContainer}>
            {Array.from({ length: totalQuestions }, (_, index) => {
              const questionNumber = index + 1
              const isAnswered = answeredQuestions[questionNumber] !== undefined
              const isBookmarked = bookmarkedQuestions[questionNumber]
              const isCurrent = currentQuestion === index
              
              let questionClass = styles.questionDot
              if (isCurrent) {
                questionClass += ` ${styles.current}`
              } else if (isBookmarked) {
                questionClass += ` ${styles.bookmarked}`
              } else if (isAnswered) {
                questionClass += ` ${styles.answered}`
              } else {
                questionClass += ` ${styles.unanswered}`
              }
              
              return (
                <button
                  key={index}
                  className={questionClass}
                  onClick={() => onQuestionClick && onQuestionClick(index)}
                  aria-label={`Go to question ${questionNumber}${isCurrent ? ' (current)' : ''}${isAnswered ? ' (answered)' : ''}${isBookmarked ? ' (bookmarked)' : ''}`}
                  title={`Question ${questionNumber}${isCurrent ? ' - Current' : ''}${isAnswered ? ' - Answered' : ''}${isBookmarked ? ' - Bookmarked' : ''}`}
                >
                  {questionNumber}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressIndicator