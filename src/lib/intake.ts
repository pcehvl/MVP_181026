import { JOB_FAMILIES, type JobFamily } from './job-families'

/**
 * Intake model for US-001 ("Answer a few questions about my situation").
 * All wording and behaviour is decided in
 * product/stories/US-001-situation-questions/spec.md — do not change without
 * a Product Owner decision.
 */

/** Q1 — decided options (spec, Decided Intake, 2026-10-18). */
export const QUALIFICATION_OPTIONS = [
  'No schooling',
  'Some primary school',
  'Finished primary school',
  'Some high school',
  'Matric (finished high school)',
  'Trade course or other qualification',
] as const

export type Qualification = (typeof QUALIFICATION_OPTIONS)[number]

/** Q2 — free text; suggestions are typing aids, not a closed list. */
export const AREA_SUGGESTIONS = [
  'Khayelitsha',
  'Mitchells Plain',
  'Gugulethu',
  'Delft',
  'Athlone',
  'Milnerton',
  'Southern Suburbs',
] as const

/** Q3 — "Not sure" is a first-class option (spec AC7/AC8). */
export const NOT_SURE = 'Not sure'

/**
 * Answers for the current session only (decision, 2026-10-18 — no saving
 * across sessions in the MVP; see spec Out of Scope and US-006).
 */
export interface IntakeAnswers {
  qualification: Qualification
  area: string
  /**
   * Selected job families for Q3. An empty array means the resident skipped
   * the question; a selection of only `NOT_SURE` means they said so. Both
   * behave identically (spec AC6/AC7) and resolve to all families via
   * {@link consideredFamilies}.
   */
  selectedWork: string[]
}

/**
 * The families to consider in the skills map: the resident's selection, or
 * ALL families when they chose "Not sure" or skipped Q3 (spec AC7).
 *
 * Always returned in seeded content order (US-003 AC10) regardless of the
 * order selections were made.
 */
export function consideredFamilies(selectedWork: string[]): JobFamily[] {
  const selected = selectedWork.filter(
    (item): item is JobFamily =>
      item !== NOT_SURE && (JOB_FAMILIES as readonly string[]).includes(item),
  )
  if (selected.length === 0) return [...JOB_FAMILIES]
  return JOB_FAMILIES.filter((family) => selected.includes(family))
}
