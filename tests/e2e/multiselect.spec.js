import { test, expect } from '@playwright/test'
import { goToLeadingSafeExamSettings, startLeadingSafeQuiz } from './_helpers'

test.describe('Multi-select validation', () => {
  test('enforces exact selection count', async ({ page }) => {
  await goToLeadingSafeExamSettings(page)
  // Switch to practice mode to include multi-select distribution
  await startLeadingSafeQuiz(page, { mode: 'practice' })

    // Advance until we find a multi-select (badge contains Multiple Choice)
    for (let i = 0; i < 30; i++) {
      if (await page.locator('text=Multiple Choice').first().isVisible().catch(()=>false)) break
      const next = page.getByTestId('quiz-next')
      if (await next.isDisabled()) break
      await next.click()
    }

    // Get requirement text
    let requirement = await page.getByTestId('multi-select-requirement').textContent()
    const neededMatch = requirement.match(/Select exactly\s+(\d+)/i)
    const needed = neededMatch ? parseInt(neededMatch[1], 10) : 2

    // Click first (needed) options
    for (let i = 0; i < needed; i++) {
      await page.getByTestId(`quiz-option-${i}`).click()
    }

    // Progress indicator should show needed selected
    await expect(page.getByTestId('multi-select-progress')).toContainText(`${needed} of ${needed} selected`)

    // Click one extra to trigger warning
  await page.getByTestId(`quiz-option-${needed}`).click()
  // UI displays pattern: 'X of N selected (1 too many)'
  await expect(page.getByTestId('multi-select-progress')).toContainText('too many')
  })
})
