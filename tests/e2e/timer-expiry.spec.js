import { test, expect } from '@playwright/test'
import { goToLeadingSafeExamSettings, startLeadingSafeQuiz, answerFirstNQuestions } from './_helpers'

// Simplified: ensure small exam can be completed & results rendered (no timer force dependency)
test.describe('Exam completion (small set)', () => {
  test('complete 10-question exam and view results', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.__E2E__ = true
        localStorage.setItem('helpSystem.tour.seen.v1','true')
        localStorage.setItem('e2e.suppressTour','true')
      } catch {}
    })
    await goToLeadingSafeExamSettings(page)
    await startLeadingSafeQuiz(page, { questionCount: 10 })
    // Answer all questions quickly
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await answerFirstNQuestions(page, 10)
        break
      } catch (e) {
        if (attempt === 1) throw e
        await page.waitForTimeout(500)
      }
    }
    // Navigate to last question just in case
    // Attempt submission
    await page.getByTestId('quiz-submit').click()
    await expect(page.getByTestId('results-score')).toBeVisible()
  })
})
