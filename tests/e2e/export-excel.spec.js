// Playwright test for Excel export functionality
// Verifies current attempt export (from results screen) and history-only export (from persistence notice)

import { test, expect } from '@playwright/test'

async function navigateToLeadingSafeExam(page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('e2e.suppressTour', 'true'); } catch {}
  })
  await page.goto('/')
  await page.getByTestId('start-leading-safe-home').click()
  await page.getByTestId('leading-safe-exam-config').waitFor()
}

// Helper to start a minimal exam, answer a couple of questions, submit, then export
async function completeExamAndExport(page) {
  await navigateToLeadingSafeExam(page)
  await page.getByTestId('leading-safe-start-quiz').click()
  // Wait for quiz root
  await page.getByTestId('quiz-root').waitFor()
  // Answer first two questions (single-select assumption)
  for (let i = 0; i < 2; i++) {
    await page.getByTestId('quiz-option-0').first().click()
    if (i === 0) {
      await page.getByTestId('quiz-next').click()
    }
  }
  // Submit
  await page.getByTestId('quiz-submit').click()
  await page.getByTestId('results-score-circle').waitFor()
  const [ download ] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('results-export-excel').click()
  ])
  expect(download.suggestedFilename()).toMatch(/exam-results-.*\.xlsx$/)
}

// Test exporting after completing an exam
// Mark as serial to reduce flakiness across browsers
// Using only Chromium in CI for now due to known Firefox/WebKit instability with full flows

test.describe('Excel Export', () => {
  test('exports current attempt workbook from results page', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Full attempt export stable only in Chromium currently')
    await completeExamAndExport(page)
  })

  test('exports history workbook from settings notice (no attempt)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'History export smoke limited to Chromium for stability')
    await page.addInitScript(() => {
      try {
        const sample = [{
          date: new Date().toISOString(),
          examType: 'Leading SAFe 6',
          score: 82,
          correctAnswers: 37,
            totalQuestions: 45,
          timeUsed: 1200
        }]
        localStorage.setItem('progress.sessions', JSON.stringify(sample))
        localStorage.setItem('e2e.suppressTour','true')
      } catch {}
    })
    await navigateToLeadingSafeExam(page)
    const exportBtn = page.getByTestId('data-persistence-export')
    await exportBtn.scrollIntoViewIfNeeded()
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      exportBtn.click()
    ])
    expect(download.suggestedFilename()).toMatch(/exam-results-.*\.xlsx$/)
  })
})
