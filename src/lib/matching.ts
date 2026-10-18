import { JOB_FAMILIES, type JobFamily } from './job-families'
import {
  QUALIFICATION_OPTIONS,
  consideredFamilies,
  type IntakeAnswers,
  type Qualification,
} from './intake'

/**
 * US-003 — "See my personalised skills map" matching rules.
 * Spec: product/stories/US-003-personalised-skills-map/spec.md (status: ready).
 *
 * DECISION (Product Owner, 2026-10-18): a resident qualifies for a job family
 * when their US-001 Q1 qualification meets that family's minimum level AND
 * the family is in their Q3 selection (skip/"Not sure" → all families).
 * Near-misses are never silently dropped — see the spec's near-miss ACs.
 *
 * MIN_QUALIFICATION LEVELS: drafted by the project team; PRODUCT OWNER
 * APPROVAL REQUIRED before residents see the map (US-003 spec, Decided
 * Structure — same content gate as US-002).
 */

export const MIN_QUALIFICATION: Record<JobFamily, Qualification> = {
  Cleaning: 'No schooling',
  'Building and manual work': 'No schooling',
  'Cooking and food work': 'No schooling',
  'Hair and beauty': 'Some primary school',
  Caregiving: 'Some primary school',
  'Retail and shops': 'Finished primary school',
  'Driving and delivery': 'Finished primary school',
  'Office and admin work': 'Some high school',
  'Working with computers': 'Some high school',
}

/** 0 = lowest requirement … 5 = highest (order of QUALIFICATION_OPTIONS). */
export function qualificationRank(qualification: Qualification): number {
  return QUALIFICATION_OPTIONS.indexOf(qualification)
}

export interface MapMatch {
  /** All families in the resident's considered set, in seeded content order. */
  considered: JobFamily[]
  /** Considered families whose minimum level the resident meets (content order). */
  qualifying: JobFamily[]
  /** Considered families whose minimum level is not met (content order). */
  nearMiss: JobFamily[]
  /** First 3 qualifying families — what the MVP map shows (AC10). */
  topFamilies: JobFamily[]
  /** Qualifying families beyond the top 3 (for the honest count line). */
  qualifyingOverflowCount: number
  /** Near-misses beyond the 2 shown (AC9 count line). */
  nearMissOverflowCount: number
}

export function matchMap(answers: IntakeAnswers): MapMatch {
  const considered = consideredFamilies(answers.selectedWork)
  const residentRank = qualificationRank(answers.qualification)

  const qualifying = considered.filter(
    (family) => residentRank >= qualificationRank(MIN_QUALIFICATION[family]),
  )
  const nearMiss = considered.filter(
    (family) => residentRank < qualificationRank(MIN_QUALIFICATION[family]),
  )

  return {
    considered,
    qualifying,
    nearMiss,
    topFamilies: qualifying.slice(0, 3),
    qualifyingOverflowCount: Math.max(0, qualifying.length - 3),
    nearMissOverflowCount: Math.max(0, nearMiss.length - 2),
  }
}

/** Seeded content order — the explicit, non-demand ranking (AC10). */
export const CONTENT_ORDER: JobFamily[] = [...JOB_FAMILIES]
