import type { IntakeAnswers } from './intake'

/**
 * US-006 AC5 — on-device journey persistence (browser localStorage only).
 * Spec: product/stories/US-006-end-to-end-journey/spec.md (status: ready).
 *
 * DECISION (Product Owner, 2026-10-18): answers survive interruptions
 * (battery dies, data drops, tab closes) — they are saved in the phone's
 * browser storage and never sent anywhere (no server, no account).
 * "Start again" wipes them: that is the resident's control over data left
 * on a shared phone. This supersedes US-001's original session-only choice
 * (dated supersession note in US-001's spec).
 *
 * Storage failures (private mode, quota, disabled storage) degrade
 * gracefully: the journey still works, it just will not resume.
 */

export const STORAGE_KEY = 'mvp-journey-answers-v1'

function isIntakeAnswers(value: unknown): value is IntakeAnswers {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.qualification === 'string' &&
    typeof candidate.area === 'string' &&
    Array.isArray(candidate.selectedWork) &&
    candidate.selectedWork.every((item) => typeof item === 'string')
  )
}

export function saveAnswers(answers: IntakeAnswers): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // Storage unavailable — journey works without resume.
  }
}

export function loadAnswers(): IntakeAnswers | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isIntakeAnswers(parsed)) {
      // Wrong shape: never hand garbage to the journey; drop it (AC5 honesty).
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearAnswers(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable — nothing to wipe.
  }
}
