import { expect, test } from '@playwright/test'

test('renders the application shell', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText(/harness ready/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /stack verified/i })).toBeVisible()
})
