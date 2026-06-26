import { describe, it, expect } from 'vitest'
import { scoreQuestion, aggregateScore, formatMilliseconds, formatTotalSeconds } from '../utils/examScoring.js'

describe('examScoring utilities', () => {
  it('scores single-select correctly', () => {
    const q = { correctAnswer: 2 }
    expect(scoreQuestion(q, 2)).toBe(1)
    expect(scoreQuestion(q, 1)).toBe(0)
  })
  it('scores multi-select with partial credit and penalties', () => {
    const q = { questionType: 'multiple', correctAnswers: [0,2] }
    // perfect
    expect(scoreQuestion(q, [0,2])).toBe(1)
    // one correct one incorrect -> (1 - 1)/2 = 0 -> clamped 0
    expect(scoreQuestion(q, [0,1])).toBe(0)
    // one correct only -> (1 - 0)/2 = 0.5
    expect(scoreQuestion(q, [0])).toBe(0.5)
  })
  it('aggregateScore returns raw and percentage', () => {
    const questions = [
      { question: { correctAnswer: 1 }, userAnswer: 1 },
      { question: { questionType: 'multiple', correctAnswers: [0,1] }, userAnswer: [0] }
    ]
    const { raw, percentage } = aggregateScore(questions)
    expect(raw).toBeCloseTo(1.5)
    expect(Math.round(percentage)).toBe(75)
  })
  it('formatMilliseconds formats properly', () => {
    expect(formatMilliseconds(0)).toBe('0:00')
    expect(formatMilliseconds(65000)).toBe('1:05')
  })
  it('formatTotalSeconds formats composite times', () => {
    expect(formatTotalSeconds(59)).toBe('0m 59s')
    expect(formatTotalSeconds(3665)).toBe('1h 1m 5s')
  })
})
