/**
 * PROVISIONAL seeded job families for the bootcamp MVP.
 *
 * US-001 AC8 requires that the Q3 work-interest options equal US-002's
 * seeded job families. US-002 ("Trust the skills data I am shown") is not
 * refined yet, so this list is a provisional placeholder chosen to cover
 * common entry-level job families in the Cape Town context.
 *
 * When US-002 is refined, this list becomes the single source of truth for
 * the seeded families and must be updated together with the US-002 content
 * (provenance and honest labelling live in US-002, not here).
 *
 * Source of truth for the decision: product/stories/US-001-situation-questions/spec.md
 */
export const JOB_FAMILIES = [
  'Retail and shops',
  'Cleaning',
  'Building and manual work',
  'Office and admin work',
  'Driving and delivery',
  'Cooking and food work',
  'Hair and beauty',
  'Working with computers',
  'Caregiving',
] as const

export type JobFamily = (typeof JOB_FAMILIES)[number]
