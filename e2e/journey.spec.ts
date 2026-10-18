import { expect, test, type Page } from '@playwright/test'

/**
 * US-006 ("Complete the whole journey on my phone") — critical E2E journeys.
 * Spec: product/stories/US-006-end-to-end-journey/spec.md (status: ready).
 *
 * Covers the integrated slice: US-001 intake → US-003 map (US-002 content)
 * → US-004 lessons → US-005 practical step, plus US-006 AC5 persistence
 * (save on-device, resume after interruption, wipe on Start again) and the
 * low-data promise (no media requests, AC4).
 */

const MEDIA_PATTERN = /\.(mp3|mp4|wav|webm|ogg|aac|flac|png|jpe?g|gif|webp|avif)(\?|$)/i

/** e2e is compiled without DOM lib (tsconfig.node.json) — access the browser's
 * document inside page.evaluate via an explicit structural cast. */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const doc = (
      globalThis as unknown as {
        document: { documentElement: { scrollWidth: number; clientWidth: number } }
      }
    ).document
    return doc.documentElement.scrollWidth - doc.documentElement.clientWidth
  })
}

async function answerIntakeToMap(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByRole('radio', { name: /matric/i }).click()
  await page.getByRole('button', { name: /next/i }).click()
  await page.getByLabel('Your area').fill('Khayelitsha')
  await page.getByRole('button', { name: /next/i }).click()
  // Q3 skippable — skip it (all families considered).
  await page.getByRole('button', { name: /show my skills map/i }).click()
  await expect(
    page.getByRole('heading', { name: /work we will look at with you/i }),
  ).toBeVisible()
}

test('critical journey: intake → map → lesson → next step → start again', async ({ page }) => {
  const mediaRequests: string[] = []
  page.on('request', (request) => {
    if (MEDIA_PATTERN.test(request.url())) mediaRequests.push(request.url())
  })

  await answerIntakeToMap(page)
  // US-003: personalised map with the honest count line.
  await expect(page.getByText(/showing 3 of 9 kinds of work/i)).toBeVisible()

  // US-004: first skill's lessons.
  await page.getByRole('button', { name: /try a sample lesson/i }).first().click()
  await expect(page.getByRole('heading', { name: 'Serving customers kindly' })).toBeVisible()
  await expect(page.getByRole('region', { name: /what this looks at work/i })).toBeVisible()
  await expect(page.getByRole('region', { name: /try this/i })).toBeVisible()
  await page.getByRole('button', { name: /back to my skills map/i }).click()
  await expect(
    page.getByRole('heading', { name: /work we will look at with you/i }),
  ).toBeVisible()

  // US-005: the closing practical step, pre-filled from the map.
  await page.getByRole('button', { name: /see my practical next step/i }).click()
  await expect(
    page.getByRole('heading', { name: /3-sentence introduction/i }),
  ).toBeVisible()
  await expect(page.getByText(/khayelitsha/i)).toBeVisible()
  await expect(page.getByText(/retail and shops/i)).toBeVisible()

  // AC4: nothing media-shaped was requested anywhere on the journey.
  expect(mediaRequests).toEqual([])

  // Journey ends: Start again → intake.
  await page.getByRole('button', { name: /start again/i }).click()
  await expect(page.getByText('Question 1 of 3')).toBeVisible()
})

test('AC5 — interruption: reload resumes at the map; Start again wipes the save', async ({ page }) => {
  await answerIntakeToMap(page)

  // Interruption: battery dies / tab closes → resident returns (reload).
  await page.reload()
  await expect(
    page.getByRole('heading', { name: /work we will look at with you/i }),
  ).toBeVisible()
  await expect(page.getByText(/khayelitsha/i)).toBeVisible()

  // Start again wipes; a fresh visit begins at Question 1.
  await page.getByRole('button', { name: /start again/i }).click()
  await page.reload()
  await expect(page.getByText('Question 1 of 3')).toBeVisible()
})

test('AC1/AC4 — phone width 320px: no horizontal scrolling on map or step', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await answerIntakeToMap(page)

  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)

  await page.getByRole('button', { name: /see my practical next step/i }).click()
  await expect(
    page.getByRole('heading', { name: /3-sentence introduction/i }),
  ).toBeVisible()
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
})

/**
 * US-007 AC1 — with no Supabase project configured (this environment), the
 * optional save-across-phones feature must be invisible: the journey is
 * exactly the US-006 build and Question 1 gains no account UI at all.
 * Spec: product/stories/US-007-optional-save-across-phones/spec.md (ready).
 */
test('US-007 AC1 — no account UI anywhere while no backend is configured', async ({ page }) => {
  await page.goto('/')
  // Question 1 is byte-for-byte unchanged: no sign-in, no email field.
  await expect(page.getByText('Question 1 of 3')).toBeVisible()
  await expect(page.getByText(/keep my journey/i)).toHaveCount(0)
  await expect(page.getByLabel(/your email address/i)).toHaveCount(0)

  await answerIntakeToMap(page)
  await expect(page.getByText(/keep my journey/i)).toHaveCount(0)
  await expect(page.getByText(/your journey is saved to your account/i)).toHaveCount(0)

  await page.getByRole('button', { name: /see my practical next step/i }).click()
  await expect(
    page.getByRole('heading', { name: /3-sentence introduction/i }),
  ).toBeVisible()
  await expect(page.getByText(/keep my journey/i)).toHaveCount(0)
})
