import { test, expect } from '@playwright/test'

// Single smoke test; run only in firefox/webkit via --project selection
// Usage: npx playwright test tests/e2e/quiz-init-smoke.spec.js --project=firefox --project=webkit
test('quiz init smoke captures early errors', async ({ page }, testInfo) => {
  // Capture console for extra diagnostics
  const consoleMessages = []
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }))

  await page.goto('/')

  // Navigate to exam start page deterministically
  await page.getByTestId('nav-exams').click()
  await page.getByTestId('start-ab730-exams').click()

  // Sanity: exam settings visible
  await expect(page.getByTestId('ab730-exam-settings')).toBeVisible({ timeout: 5000 })

  // Start quiz - look for the Start button
  await page.locator('button:has-text("Start Practice Exam")').first().click()

  // Wait for quiz to load - check for question text or quiz container
  await page.waitForSelector('.quiz-container, [class*="quiz"], button:has-text("Submit")', { timeout: 10000 })

  // Pull diagnostics from localStorage
  const diagnostics = await page.evaluate(() => ({
    globalErrors: (window.__dumpGlobalErrors && window.__dumpGlobalErrors()) || [],
    quizInitError: (() => { try { return JSON.parse(localStorage.getItem('e2e.quizInitError') || 'null') } catch { return null } })(),
    logs: (() => { try { return JSON.parse(localStorage.getItem('e2e.logs') || '[]') } catch { return [] } })()
  }))

  // Attach artifacts for debugging
  await testInfo.attach('console.log', { body: JSON.stringify(consoleMessages, null, 2), contentType: 'application/json' })
  await testInfo.attach('quiz-init-diagnostics.json', { body: JSON.stringify(diagnostics, null, 2), contentType: 'application/json' })

  // Verify no init errors
  expect(diagnostics.quizInitError).toBeNull()
  
  // Basic check: page should have quiz elements
  const hasQuizElements = await page.locator('button, input[type="radio"], input[type="checkbox"]').count() > 0
  expect(hasQuizElements).toBe(true)
})
