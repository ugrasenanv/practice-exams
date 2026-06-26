import { test, expect } from '@playwright/test'
import { goToLeadingSafeExamSettings, startLeadingSafeQuiz, answerFirstNQuestions } from './_helpers'

// Increase timeout for slower browsers (Firefox/WebKit) when needed
test.setTimeout(45_000)

test.describe('Leading SAFe Exam Flow', () => {
  test('start exam, answer, submit, view results', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.__E2E__ = true
      localStorage.setItem('helpSystem.tour.seen.v1','true')
      localStorage.setItem('e2e.suppressTour','true')
    } catch {}
  })
  // Capture console logs for debugging failing browsers
  const logs = []
  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() })
  })

  await goToLeadingSafeExamSettings(page)

  // Use smaller question count only on Chromium / mobile-chrome; let others use default to reduce potential race with mode toggling
  const useSmall = /chromium|chrome/i.test(test.info().project.name)
  await startLeadingSafeQuiz(page, useSmall ? { questionCount: 10 } : {})

    // Ensure quiz loaded
    await expect(page.getByTestId('quiz-question-text')).toBeVisible()

    // Answer a few questions (retry wrapper for flakiness)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await answerFirstNQuestions(page, 3)
        break
      } catch (e) {
        if (attempt === 1) throw e
        await page.waitForTimeout(500)
      }
    }

    // Debug: capture quiz readiness debug info if present
    await page.evaluate(() => {
      const dbg = localStorage.getItem('e2e.quizReady.debug')
      if (dbg) console.log('[E2E DEBUG quizReady]', dbg)
    })

    // Navigate backwards once
    await page.getByTestId('quiz-prev').click()

    // Submit
    await page.getByTestId('quiz-submit').click()

    // Expect results view (heuristic: presence of percentage or score text)
    await expect(page.getByTestId('results-score')).toBeVisible()

    // Store logs in localStorage for retrieval if needed
    await page.evaluate(l => localStorage.setItem('e2e.console', JSON.stringify(l)), logs)
  })
})
