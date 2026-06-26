import { test, expect } from '@playwright/test'
import { goToLeadingSafeExamSettings, startLeadingSafeQuiz } from './_helpers'

test.describe('Help System', () => {
  test('help fab toggles panel', async ({ page }) => {
    await goToLeadingSafeExamSettings(page)
    await startLeadingSafeQuiz(page)

  // Open via FAB and wait briefly for mount
  await page.getByTestId('help-fab').click()
  await expect(page.getByTestId('help-panel')).toBeVisible()

    // Close via FAB
  await page.getByTestId('help-fab').click()
  await expect(page.getByTestId('help-panel')).not.toBeVisible()
  })
})
