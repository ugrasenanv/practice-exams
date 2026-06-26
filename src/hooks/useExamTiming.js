// Hook to encapsulate exam timing logic with injectable time source & scheduler.
import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * useExamTiming
 * Provides per-question timing, current question elapsed, total time used, and countdown (if any).
 * All real time interactions go through a timeProvider (default Date.now) and a scheduler abstraction overridable in tests.
 */
export function useExamTiming({
  enabledCountdownSeconds, // number | 0 for unlimited
  questionId,
  isExamSubmitted,
  timeProvider = () => Date.now(),
  scheduler = typeof window !== 'undefined' ? {
    setInterval: (cb, ms) => window.setInterval(cb, ms),
    clearInterval: (id) => window.clearInterval(id),
    setTimeout: (cb, ms) => window.setTimeout(cb, ms),
    clearTimeout: (id) => window.clearTimeout(id)
  } : {
    setInterval: (cb) => { cb.__immediate = true; return 0 },
    clearInterval: () => {},
    setTimeout: (cb) => { cb.__immediate = true; return 0 },
    clearTimeout: () => {}
  },
  resetToken
}) {
  const initialCountdown = enabledCountdownSeconds && enabledCountdownSeconds > 0 ? enabledCountdownSeconds : 0

  const [questionTimings, setQuestionTimings] = useState({}) // {questionId: ms}
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0)
  const [countdown, setCountdown] = useState(initialCountdown)

  const questionStartRef = useRef(null)
  const prevQuestionRef = useRef(null)
  const countdownRef = useRef(null)
  const intervalRef = useRef(null)
  const didMountRef = useRef(false)

  const clearIntervals = useCallback(() => {
    if (intervalRef.current) {
      scheduler.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (countdownRef.current) {
      scheduler.clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }, [scheduler])

  const reset = useCallback(() => {
    clearIntervals()
    setQuestionTimings({})
    setCurrentQuestionTime(0)
    setCountdown(initialCountdown)
    questionStartRef.current = null
    prevQuestionRef.current = null
  }, [clearIntervals, initialCountdown])

  useEffect(() => () => clearIntervals(), [clearIntervals])

  // Handle question change (depends only on questionId & submission state)
  useEffect(() => {
    if (isExamSubmitted) return
    const now = timeProvider()

    if (prevQuestionRef.current && questionStartRef.current) {
      const elapsed = now - questionStartRef.current
      const prevId = prevQuestionRef.current
      setQuestionTimings(prev => ({
        ...prev,
        [prevId]: (prev[prevId] || 0) + elapsed
      }))
    }

    questionStartRef.current = now
    setCurrentQuestionTime(0)
    prevQuestionRef.current = questionId
  }, [questionId, isExamSubmitted])

  // Per-question elapsed updater (every second)
  useEffect(() => {
    if (isExamSubmitted || questionStartRef.current == null) return
    intervalRef.current && scheduler.clearInterval(intervalRef.current)
    intervalRef.current = scheduler.setInterval(() => {
      const now = timeProvider()
      if (questionStartRef.current != null) {
        setCurrentQuestionTime(now - questionStartRef.current)
      }
    }, 1000)
    return () => intervalRef.current && scheduler.clearInterval(intervalRef.current)
  }, [questionId, isExamSubmitted, scheduler])

  // Countdown logic
  useEffect(() => {
    if (!enabledCountdownSeconds || enabledCountdownSeconds <= 0) return
    if (isExamSubmitted) return

    setCountdown(enabledCountdownSeconds)
    countdownRef.current && scheduler.clearInterval(countdownRef.current)
    countdownRef.current = scheduler.setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => countdownRef.current && scheduler.clearInterval(countdownRef.current)
  }, [enabledCountdownSeconds, isExamSubmitted, scheduler])

  // Respond to reset token changes (skip on initial mount to avoid double reset)
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }
    if (resetToken === undefined) return
    reset()
  }, [resetToken, reset])

  // Finalize on submit
  const finalize = useCallback(() => {
    if (isExamSubmitted || questionStartRef.current == null) return
    const now = timeProvider()
    const elapsed = now - questionStartRef.current
    const qid = prevQuestionRef.current
    setQuestionTimings(prev => ({
      ...prev,
      [qid]: (prev[qid] || 0) + elapsed
    }))
  }, [isExamSubmitted, timeProvider])

  return {
    questionTimings,
    currentQuestionTime,
    countdown,
    finalize,
    reset
  }
}

export default useExamTiming
