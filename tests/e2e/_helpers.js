import { test } from '@playwright/test'

// Global beforeEach to seed localStorage (auto-dismiss help tour & panel) before any page navigation.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.__E2E__ = true
      localStorage.setItem('helpSystem.tour.seen.v1', 'true')
    } catch (_) {}
  })
})

// Helper: navigate to Leading SAFe 6 exam settings page (with mobile fallback via hamburger menu)
export async function goToLeadingSafeExamSettings(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 })
      break
    } catch (e) {
      if (attempt === 2) throw e
    }
  }
  // Close any obstructive overlays (e.g., menu) before interacting
  const tryClick = async (locator) => {
    if (await locator.isVisible().catch(()=>false)) {
      await locator.click({ trial: false })
      return true
    }
    return false
  }

  // Primary: desktop nav button
  if (await tryClick(page.getByTestId('nav-exams'))) {
    await tryClick(page.getByTestId('start-leading-safe-exams'))
    await page.getByTestId('leading-safe-exam-settings').waitFor({ timeout: 10000 })
    return
  }

  // Secondary: featured card on home
  if (await tryClick(page.getByTestId('start-leading-safe-home'))) {
    await page.getByTestId('leading-safe-exam-settings').waitFor({ timeout: 10000 })
    return
  }

  // Tertiary: hamburger flow
  if (await tryClick(page.getByTestId('nav-hamburger-toggle'))) {
    const examsButton = page.getByRole('button', { name: /exams/i })
    if (await tryClick(examsButton)) {
      await tryClick(page.getByTestId('start-leading-safe-exams'))
      await page.getByTestId('leading-safe-exam-settings').waitFor({ timeout: 10000 })
      return
    }
  }

  throw new Error('Unable to navigate to Leading SAFe exam settings via any fallback path')
}

export async function startLeadingSafeQuiz(page, options = {}) {
  const { mode, questionCount } = options
  if (mode) {
    await page.getByTestId('leading-safe-exam-mode-select').selectOption(mode)
  }
  if (questionCount) {
    await page.getByTestId('leading-safe-questions-select').selectOption(String(questionCount))
  }
  // Retry start button click in case of flakiness
  const startBtn = page.getByTestId('leading-safe-start-quiz')
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await startBtn.click({ timeout: 5000, trial: false })
      break
    } catch (e) {
      if (attempt === 2) throw e
      await page.waitForTimeout(250)
    }
  }
  // If session recovery appears, dismiss it for deterministic flow
  if (await page.getByTestId('session-recovery-overlay').isVisible().catch(()=>false)) {
    // Prefer dismiss-all for clean start
    const dismissAll = page.getByTestId('session-recovery-dismiss-all')
    if (await dismissAll.isVisible().catch(()=>false)) {
      await dismissAll.click()
    } else {
      const close = page.getByTestId('session-recovery-close')
      if (await close.isVisible().catch(()=>false)) await close.click()
    }
  }
  await waitForQuizReady(page)
}

export async function answerFirstNQuestions(page, n) {
  for (let i = 0; i < n; i++) {
    await ensureNoOverlays(page)
    // Wait for at least one option
    await page.getByTestId('quiz-option-0').waitFor({ state: 'visible' })
    await page.getByTestId('quiz-option-0').click({ trial: false })
    const next = page.getByTestId('quiz-next')
    if (await next.isDisabled().catch(()=>false)) break
    const prevId = await page.getByTestId('quiz-question-card').getAttribute('data-question-id')
    await next.click({ trial: false, force: true })
    await page.waitForFunction((prev) => {
      const el = document.querySelector('[data-testid="quiz-question-card"]')
      return el && el.getAttribute('data-question-id') !== prev
    }, prevId, { timeout: 5000 }).catch(async () => {
      // Fallback: try selecting a different option to force state change
      if (await page.getByTestId('quiz-option-1').isVisible().catch(()=>false)) {
        await page.getByTestId('quiz-option-1').click({ force: true })
      }
    })
  }
}

// Utility: remove obstructive overlays (help tour, leftover modals) if present
async function ensureNoOverlays(page) {
  // Remove help tour overlay if it somehow rendered
  const tourOverlay = await page.locator('[aria-label="Help tour"]').elementHandle().catch(()=>null)
  if (tourOverlay) {
    await page.evaluate(() => {
      const tour = document.querySelector('[aria-label="Help tour"]')
      if (tour && tour.parentElement) tour.parentElement.removeChild(tour)
      try { localStorage.setItem('helpSystem.tour.seen.v1','true') } catch(_) {}
      if (window) window.__E2E__ = true
    })
  }
  // Dismiss session recovery if it appears mid-quiz
  if (await page.getByTestId('session-recovery-overlay').isVisible().catch(()=>false)) {
    const dismissAll = page.getByTestId('session-recovery-dismiss-all')
    if (await dismissAll.isVisible().catch(()=>false)) {
      await dismissAll.click()
    } else {
      const close = page.getByTestId('session-recovery-close')
      if (await close.isVisible().catch(()=>false)) await close.click()
    }
  }
}

async function waitForQuizReady(page) {
  const start = Date.now()
  const quizRoot = page.getByTestId('quiz-root')
  const quizLoading = page.getByTestId('quiz-loading')
  const questionText = page.getByTestId('quiz-question-text')
  try {
    await Promise.race([
      quizRoot.waitFor({ timeout: 6000 }).catch(()=>null),
      quizLoading.waitFor({ timeout: 6000 }).catch(()=>null)
    ])
    await questionText.waitFor({ timeout: 6000 })
  } catch (e) {
    // Fallback: look for options container
    const optionsVisible = await page.getByTestId('quiz-options-container').isVisible().catch(()=>false)
    await page.evaluate((info) => {
      try { localStorage.setItem('e2e.quizReady.debug', JSON.stringify(info)) } catch(_) {}
    }, {
      error: String(e),
      time: Date.now() - start,
      rootVisible: await quizRoot.isVisible().catch(()=>false),
      loadingVisible: await quizLoading.isVisible().catch(()=>false),
      optionsVisible
    })
    if (!optionsVisible) throw e
  }
}
