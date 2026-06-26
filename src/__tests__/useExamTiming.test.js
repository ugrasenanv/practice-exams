import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useExamTiming } from '../hooks/useExamTiming'

// Custom virtual scheduler
function createScheduler(timeRef) {
  let intervals = new Map() // id -> {cb, ms, elapsed}
  let nextId = 1
  return {
    setInterval(cb, ms) {
      const id = nextId++
      intervals.set(id, { cb, ms, elapsed: 0 })
      return id
    },
    clearInterval(id) { intervals.delete(id) },
    setTimeout(cb, ms) { // treat as interval that auto-clears
      const id = nextId++
      intervals.set(id, { cb: () => { cb(); intervals.delete(id) }, ms, elapsed: 0 })
      return id
    },
    clearTimeout(id) { intervals.delete(id) },
    tick(seconds) {
      for (let s = 0; s < seconds; s++) {
        timeRef.current += 1000
        // advance each interval
        intervals.forEach((entry) => {
          entry.elapsed += 1000
          if (entry.elapsed >= entry.ms) {
            entry.elapsed = 0
            entry.cb()
          }
        })
      }
    }
  }
}

describe('useExamTiming hook', () => {
  it('tracks per-question elapsed time', () => {
    const timeRef = { current: 0 }
    const scheduler = createScheduler(timeRef)
    const timeProvider = () => timeRef.current
    const { result, rerender } = renderHook(({ qid }) => useExamTiming({
      enabledCountdownSeconds: 0,
      questionId: qid,
      isExamSubmitted: false,
      timeProvider,
      scheduler
    }), { initialProps: { qid: 'q1' } })

    // advance 5 seconds
    act(() => { scheduler.tick(5) })
    expect(result.current.currentQuestionTime).toBe(5000)

  // explicitly finalize before changing question to commit timing
  act(() => { result.current.finalize() })
  // change question (should reset currentQuestionTime)
  act(() => { rerender({ qid: 'q2' }) })
  expect(result.current.currentQuestionTime).toBe(0)
  // advance 3 seconds on new question
  act(() => { scheduler.tick(3) })
  expect(result.current.questionTimings.q1).toBeGreaterThanOrEqual(5000)
  expect(result.current.currentQuestionTime).toBe(3000)
  })

  it('counts down when enabled', () => {
    const timeRef = { current: 0 }
    const scheduler = createScheduler(timeRef)
    const timeProvider = () => timeRef.current
    const { result } = renderHook(() => useExamTiming({
      enabledCountdownSeconds: 10,
      questionId: 'q1',
      isExamSubmitted: false,
      timeProvider,
      scheduler
    }))

    act(() => { scheduler.tick(4) })
    expect(result.current.countdown).toBe(6)
  })

  it('finalizes timing on submit', () => {
    const timeRef = { current: 0 }
    const scheduler = createScheduler(timeRef)
    const timeProvider = () => timeRef.current
    const { result, rerender } = renderHook(({ submitted }) => useExamTiming({
      enabledCountdownSeconds: 0,
      questionId: 'q1',
      isExamSubmitted: submitted,
      timeProvider,
      scheduler
    }), { initialProps: { submitted: false } })

    act(() => { scheduler.tick(2) })
    act(() => { result.current.finalize() })
    rerender({ submitted: true })
    expect(result.current.questionTimings.q1).toBeGreaterThanOrEqual(2000)
  })
})
