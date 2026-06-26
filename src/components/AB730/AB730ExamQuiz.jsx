import { useState, useEffect } from 'react'
import styles from './AB730ExamQuiz.module.css'
import AB730Questions from './AB730Questions.js'
import Results from '../shared/Results.jsx'
import ProgressIndicator from '../exam/ProgressIndicator.jsx'
import { shuffleQuestionAnswers } from '../../utils/shuffleAnswers.js'

import SessionRecovery from '../autosave/SessionRecovery.jsx'
import HelpSystem, { MultiSelectHelp } from '../help/HelpSystem.jsx'
import { useProgress } from '../../contexts/ProgressContext.jsx'
import { useStudyIntelligence } from '../../contexts/StudyIntelligenceContext.jsx'
import { useAutosave } from '../../contexts/AutosaveContext.jsx'
import { useExamTiming } from '../../hooks/useExamTiming.js'
import { useQuestionHistory } from '../../contexts/QuestionHistoryContext.jsx'
import QuestionHistory from '../QuestionHistory/QuestionHistory.jsx'
import QuestionBadge from '../shared/QuestionBadge.jsx'

function AB730ExamQuiz({ onGoHome, onGoBackToExam, numberOfQuestions = 45, autoShowExplanation = false, examMode = 'exam', scheduler }) {
  const { recordSession } = useProgress()
  const { updateSpacedRepetition } = useStudyIntelligence()
  const { saveExamState, loadExamState, clearExamState, AUTOSAVE_INTERVAL, DEBOUNCE_DELAY } = useAutosave()
  const { recordQuestionAttempt, isQuestionSeen, filterQuestions } = useQuestionHistory()

  // Adaptive timer calculation function
  const calculateTimerDuration = (questionCount) => {
    if (questionCount <= 45) {
      // Certification mode: 90 minutes (5400 seconds)
      return 5400
    } else if (questionCount <= 100) {
      // Practice mode: 2 minutes per question (120 seconds each)
      return questionCount * 120
    } else {
      // Study mode: No timer (0 = unlimited)
      return 0
    }
  }

  const initialTimer = calculateTimerDuration(numberOfQuestions)
  const hasTimer = initialTimer > 0

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [revealedAnswers, setRevealedAnswers] = useState({})
  const [collapsedExplanations, setCollapsedExplanations] = useState({})
  // countdown handled by hook (countdown == time remaining when timed)
  const [showResults, setShowResults] = useState(false)
  const [totalTimeUsed, setTotalTimeUsed] = useState(0)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set())
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const [showSessionRecovery, setShowSessionRecovery] = useState(true)
  const [lastAutosave, setLastAutosave] = useState(Date.now())
  const [timingResetToken, setTimingResetToken] = useState(0)
  
  // Hook-based timing
  const currentQuestionId = shuffledQuestions[currentQuestion]?.id
  const { questionTimings, currentQuestionTime, countdown, finalize } = useExamTiming({
    enabledCountdownSeconds: hasTimer ? initialTimer : 0,
    questionId: currentQuestionId || '__loading__',
    isExamSubmitted: examSubmitted,
    scheduler,
    resetToken: timingResetToken
  })

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled questions on component mount
  useEffect(() => {
    try {
      let availableQuestions = AB730Questions
      
      // Filter questions based on exam mode
      if (examMode === 'exam') {
        // Exam mode: only single-select questions (filter out multi-select)
        availableQuestions = AB730Questions.filter(q => !q.questionType || q.questionType !== 'multiple')
      }
      // Practice mode: include all questions (single-select + multi-select)
      
      // Apply seen/unseen filter
      availableQuestions = filterQuestions('ab730', availableQuestions)
      
      const shuffled = shuffleArray(availableQuestions)
      const selectedQuestions = shuffled.slice(0, numberOfQuestions)
      // Shuffle the options for each question using seeded randomization
      // This eliminates position bias, length bias, and visual cues
      const questionsWithShuffledOptions = selectedQuestions.map(q => shuffleQuestionAnswers(q))
      setShuffledQuestions(questionsWithShuffledOptions)

      if (typeof window !== 'undefined') {
        try {
          const logs = JSON.parse(localStorage.getItem('e2e.logs') || '[]')
          logs.push({ t: Date.now(), msg: `quiz-init-success count=${questionsWithShuffledOptions.length}` })
          localStorage.setItem('e2e.logs', JSON.stringify(logs))
        } catch(_) {}
      }
    } catch (err) {
      if (typeof window !== 'undefined') {
        try {
          const logs = JSON.parse(localStorage.getItem('e2e.logs') || '[]')
          logs.push({ t: Date.now(), msg: 'quiz-init-error', error: err && (err.message || String(err)), stack: err && err.stack })
          localStorage.setItem('e2e.logs', JSON.stringify(logs))
          localStorage.setItem('e2e.quizInitError', JSON.stringify({ message: err.message, stack: err.stack }))
        } catch(_) {}
      }
    }
  }, [numberOfQuestions, examMode])

  // Session recovery and autosave initialization
  useEffect(() => {
    if (shuffledQuestions.length === 0) return

    // Try to load existing session data
    const savedSession = loadExamState('ab730', sessionId)
    
    if (savedSession && savedSession.shuffledQuestions) {
      // Show recovery UI
      setShowSessionRecovery(true)
    } else {
      setShowSessionRecovery(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffledQuestions.length, sessionId])

  // Autosave effect
  useEffect(() => {
    if (shuffledQuestions.length === 0 || examSubmitted) return

    const autosaveTimer = setInterval(() => {
      saveExamState('ab730', sessionId, {
        currentQuestion,
        selectedAnswers,
        revealedAnswers,
        collapsedExplanations,
        bookmarkedQuestions: Array.from(bookmarkedQuestions),
        shuffledQuestions,
        totalTimeUsed: initialTimer - countdown,
        questionTimings,
        timestamp: Date.now()
      })
      setLastAutosave(Date.now())
    }, AUTOSAVE_INTERVAL)

    return () => clearInterval(autosaveTimer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffledQuestions.length, examSubmitted, sessionId, AUTOSAVE_INTERVAL])

  const handleRecoveryAccept = () => {
    const savedSession = loadExamState('ab730', sessionId)
    if (savedSession) {
      setCurrentQuestion(savedSession.currentQuestion || 0)
      setSelectedAnswers(savedSession.selectedAnswers || {})
      setRevealedAnswers(savedSession.revealedAnswers || {})
      setCollapsedExplanations(savedSession.collapsedExplanations || {})
      setBookmarkedQuestions(new Set(savedSession.bookmarkedQuestions || []))
      setShuffledQuestions(savedSession.shuffledQuestions)
      setShowSessionRecovery(false)
    }
  }

  const handleRecoveryDecline = () => {
    clearExamState('ab730', sessionId)
    setShowSessionRecovery(false)
  }

  const handleAnswerSelect = (answerIndex) => {
    const questionId = shuffledQuestions[currentQuestion].id
    const isMultiSelect = shuffledQuestions[currentQuestion].questionType === 'multiple'
    
    if (isMultiSelect) {
      // Multi-select logic
      const currentSelections = selectedAnswers[questionId] || []
      const maxSelections = shuffledQuestions[currentQuestion].selectCount
      
      if (currentSelections.includes(answerIndex)) {
        // Deselect
        setSelectedAnswers({
          ...selectedAnswers,
          [questionId]: currentSelections.filter(i => i !== answerIndex)
        })
      } else {
        // Select (if not at max)
        if (currentSelections.length < maxSelections) {
          setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: [...currentSelections, answerIndex]
          })
        }
      }
    } else {
      // Single-select logic
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: answerIndex
      })
    }
  }

  const handleToggleBookmark = () => {
    const questionId = shuffledQuestions[currentQuestion].id
    const newBookmarks = new Set(bookmarkedQuestions)
    
    if (newBookmarks.has(questionId)) {
      newBookmarks.delete(questionId)
    } else {
      newBookmarks.add(questionId)
    }
    
    setBookmarkedQuestions(newBookmarks)
  }

  const handleRevealAnswer = () => {
    const questionId = shuffledQuestions[currentQuestion].id
    setRevealedAnswers({
      ...revealedAnswers,
      [questionId]: true
    })
  }

  const handleToggleExplanation = () => {
    const questionId = shuffledQuestions[currentQuestion].id
    setCollapsedExplanations({
      ...collapsedExplanations,
      [questionId]: !collapsedExplanations[questionId]
    })
  }

  const handleNavigateQuestion = (index) => {
    setCurrentQuestion(index)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmitExam = () => {
    if (!window.confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
      return
    }

    finalize()
    const timeUsed = initialTimer > 0 ? initialTimer - countdown : Object.values(questionTimings).reduce((sum, t) => sum + t, 0)
    setTotalTimeUsed(timeUsed)
    setExamSubmitted(true)
    setShowResults(true)
    
    // Calculate score
    let correctCount = 0
    shuffledQuestions.forEach(q => {
      const userAnswer = selectedAnswers[q.id]
      const isMultiSelect = q.questionType === 'multiple'
      
      if (isMultiSelect) {
        const userSet = new Set(userAnswer || [])
        const correctSet = new Set(q.correctAnswers)
        if (userSet.size === correctSet.size && [...userSet].every(a => correctSet.has(a))) {
          correctCount++
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correctCount++
        }
      }
    })

    // Record session
    recordSession('ab730', {
      score: correctCount,
      total: shuffledQuestions.length,
      timeUsed,
      questionTimings
    })

    // Update spaced repetition and record question attempts
    shuffledQuestions.forEach(q => {
      const userAnswer = selectedAnswers[q.id]
      const isCorrect = q.questionType === 'multiple' 
        ? new Set(userAnswer || []).size === q.correctAnswers.length && (userAnswer || []).every(a => q.correctAnswers.includes(a))
        : userAnswer === q.correctAnswer
      
      updateSpacedRepetition(`ab730-${q.id}`, isCorrect)
      recordQuestionAttempt('ab730', q.id, isCorrect)
    })

    clearExamState('ab730', sessionId)
  }

  const handleRetakeExam = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setRevealedAnswers({})
    setCollapsedExplanations({})
    setShowResults(false)
    setTotalTimeUsed(0)
    setExamSubmitted(false)
    setBookmarkedQuestions(new Set())
    setTimingResetToken(prev => prev + 1)
    
    // Reshuffle questions with seeded randomization to eliminate biases
    const shuffled = shuffleArray(AB730Questions)
    const selectedQuestions = shuffled.slice(0, numberOfQuestions)
    const questionsWithShuffledOptions = selectedQuestions.map(q => shuffleQuestionAnswers(q))
    setShuffledQuestions(questionsWithShuffledOptions)
  }

  // Timer expiry handler
  useEffect(() => {
    if (hasTimer && countdown <= 0 && !examSubmitted && shuffledQuestions.length > 0) {
      handleSubmitExam()
    }
  }, [countdown, hasTimer, examSubmitted, shuffledQuestions.length])

  if (shuffledQuestions.length === 0) {
    return <div className={styles.loading}>Loading exam questions...</div>
  }

  if (showSessionRecovery && loadExamState('ab730', sessionId)) {
    const savedSession = loadExamState('ab730', sessionId)
    return (
      <SessionRecovery
        onAccept={handleRecoveryAccept}
        onDecline={handleRecoveryDecline}
        savedSession={savedSession}
        examType="AB-730"
      />
    )
  }

  if (showResults) {
    return (
      <Results
        questions={shuffledQuestions}
        selectedAnswers={selectedAnswers}
        revealedAnswers={revealedAnswers}
        onGoHome={onGoHome}
        onRetake={handleRetakeExam}
        onGoBackToExam={onGoBackToExam}
        examType="ab730"
        totalTimeUsed={totalTimeUsed}
        questionTimings={questionTimings}
        passPercentage={70}
      />
    )
  }

  const question = shuffledQuestions[currentQuestion]
  const isMultiSelect = question.questionType === 'multiple'
  const userAnswer = selectedAnswers[question.id]
  const isAnswered = isMultiSelect ? (userAnswer && userAnswer.length > 0) : userAnswer !== undefined
  const isRevealed = revealedAnswers[question.id]
  const isExplanationCollapsed = collapsedExplanations[question.id]
  const isBookmarked = bookmarkedQuestions.has(question.id)

  const shouldShowExplanation = autoShowExplanation && isAnswered

  return (
    <div className={styles.quizContainer}>
      <header className={styles.quizHeader}>
        <div className={styles.brandSection}>
          <img src="./ai-cert-studio-logo.png" alt="AI Cert Studio" className={styles.logo} />
          <div className={styles.examTitle}>AB-730: AI Business Professional</div>
        </div>
        <div className={styles.headerControls}>
          {hasTimer && (
            <div className={`${styles.timerDisplay} ${countdown < 300 ? styles.timerWarning : ''}`}>
              ⏱️ {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
            </div>
          )}
          <button className={styles.homeButton} onClick={onGoBackToExam}>
            ← Back to Settings
          </button>
        </div>
      </header>

      <ProgressIndicator
        currentQuestion={currentQuestion}
        totalQuestions={shuffledQuestions.length}
        selectedAnswers={selectedAnswers}
        questions={shuffledQuestions}
        bookmarkedQuestions={bookmarkedQuestions}
        onNavigate={handleNavigateQuestion}
      />

      <main className={styles.quizContent}>
        <div className={styles.questionSection}>
          <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <div className={styles.questionMeta}>
                <span className={styles.questionNumber}>
                  Question {currentQuestion + 1} of {shuffledQuestions.length}
                </span>
                {!isQuestionSeen('ab730', question.id) && (
                  <QuestionBadge type="new" text="NEW" />
                )}
                {isMultiSelect && (
                  <span className={styles.multiSelectBadge}>
                    Multi-Select (Choose {question.selectCount})
                  </span>
                )}
                <span className={styles.questionDomain}>{question.domain}</span>
                <span className={styles.questionDifficulty}>{question.difficulty}</span>
              </div>
              <button 
                className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ''}`}
                onClick={handleToggleBookmark}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark for review'}
              >
                {isBookmarked ? '★' : '☆'}
              </button>
            </div>

            <div className={styles.questionText}>
              {question.question}
            </div>

          {isMultiSelect && <MultiSelectHelp selectCount={question.selectCount} />}

          <div className={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const isSelected = isMultiSelect 
                ? (userAnswer || []).includes(index)
                : userAnswer === index
              const isCorrect = isMultiSelect
                ? question.correctAnswers.includes(index)
                : question.correctAnswer === index
              const showCorrectness = isRevealed

              return (
                <button
                  key={index}
                  className={`${styles.optionButton} 
                    ${isSelected ? styles.selected : ''} 
                    ${showCorrectness && isCorrect ? styles.correct : ''} 
                    ${showCorrectness && isSelected && !isCorrect ? styles.incorrect : ''}`}
                  onClick={() => !examSubmitted && handleAnswerSelect(index)}
                  disabled={examSubmitted}
                >
                  <span className={styles.optionLabel}>{String.fromCharCode(65 + index)}.</span>
                  <span className={styles.optionText}>{option}</span>
                  {showCorrectness && isCorrect && <span className={styles.correctIndicator}>✓</span>}
                  {showCorrectness && isSelected && !isCorrect && <span className={styles.incorrectIndicator}>✗</span>}
                </button>
              )
            })}
          </div>

          {!examSubmitted && isAnswered && !isRevealed && (
            <div className={styles.revealSection}>
              <button className={styles.revealButton} onClick={handleRevealAnswer}>
                👁️ Reveal Correct Answer
              </button>
            </div>
          )}

          {(isRevealed || shouldShowExplanation) && (
            <div className={styles.explanationContainer}>
              <button 
                className={styles.explanationToggle}
                onClick={handleToggleExplanation}
              >
                <span>{isExplanationCollapsed ? '▶' : '▼'}</span>
                <span>{isExplanationCollapsed ? 'Show' : 'Hide'} Explanation</span>
              </button>
              {!isExplanationCollapsed && (
                <div className={styles.explanationContent}>
                  <div className={styles.explanationText}>
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                  <div className={styles.correctAnswerText}>
                    <strong>Correct Answer:</strong> 
                    {isMultiSelect ? (
                      <span> {question.correctAnswers.map(i => String.fromCharCode(65 + i)).join(', ')}</span>
                    ) : (
                      <span> {String.fromCharCode(65 + question.correctAnswer)}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        <div className={styles.navigationSection}>
          <div className={styles.navButtons}>
            <button 
              className={styles.navButton}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>
            {currentQuestion < shuffledQuestions.length - 1 ? (
              <button 
                className={styles.navButton}
                onClick={handleNext}
              >
                Next →
              </button>
            ) : (
              <button 
                className={`${styles.submitButton} ${!isAnswered ? styles.submitDisabled : ''}`}
                onClick={handleSubmitExam}
                disabled={!isAnswered}
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        <HelpSystem />
      </main>
    </div>
  )
}

export default AB730ExamQuiz
