import { describe, it, expect } from 'vitest'
import { buildReadinessSummary } from '../utils/certificationReadiness'

describe('buildReadinessSummary', () => {
  it('returns a certification-ready summary from session analytics', () => {
    const summary = buildReadinessSummary({
      sessions: [
        { score: 74, examType: 'AB-730', totalQuestions: 45 },
        { score: 82, examType: 'AI-900', totalQuestions: 45 },
        { score: 91, examType: 'AB-730', totalQuestions: 45 }
      ],
      focusAreas: ['Prompt Engineering', 'Responsible AI']
    })

    expect(summary.score).toBeGreaterThan(80)
    expect(summary.label).toBe('Certification-ready')
    expect(summary.nextStep).toContain('focus on Prompt Engineering')
    expect(summary.focusAreas).toEqual(['Prompt Engineering', 'Responsible AI'])
  })

  it('uses a cautious label when metrics are still early', () => {
    const summary = buildReadinessSummary({
      sessions: [{ score: 64, examType: 'AI-900', totalQuestions: 30 }],
      focusAreas: ['Azure AI Services']
    })

    expect(summary.score).toBe(64)
    expect(summary.label).toBe('Building momentum')
    expect(summary.nextStep).toContain('Complete a timed practice session')
  })
})
