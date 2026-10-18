import { expect, test } from '@playwright/test'

test('renders the application shell (intake, Question 1)', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Question 1 of 3')).toBeVisible()
  await expect(
    page.getByRole('group', { name: /highest school qualification/i }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: /next/i })).toBeVisible()
})
