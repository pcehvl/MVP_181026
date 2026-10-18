import { describe, expect, it } from 'vitest'
import { JOB_FAMILIES } from './job-families'
import { LESSONS, LESSONS_APPROVAL } from './lessons-content'
import { SKILLS_CONTENT } from './skills-content'

/**
 * US-004 ("Try short sample lessons for a skill") — content-package evidence.
 * Spec: product/stories/US-004-sample-lessons/spec.md (status: ready).
 */

const wordCount = (text: string): number => text.trim().split(/\s+/).length

describe('US-004 lesson content package', () => {
  it('AC1 — every skill in the map has exactly 2 lessons; 108 lessons total', () => {
    let total = 0
    for (const family of JOB_FAMILIES) {
      for (const skill of SKILLS_CONTENT[family].skills) {
        const lessons = LESSONS[family]?.[skill.name]
        expect(lessons, `missing lessons: ${family} / ${skill.name}`).toBeDefined()
        expect(Object.keys(lessons!).sort()).toEqual(['explainer', 'practice'])
        total += 2
      }
    }
    expect(total).toBe(108)
  })

  it('AC1 — no lesson entries outside the approved skills list', () => {
    for (const family of JOB_FAMILIES) {
      expect(Object.keys(LESSONS[family]).sort()).toEqual(
        SKILLS_CONTENT[family].skills.map((skill) => skill.name).sort(),
      )
    }
  })

  it('AC1/AC2 — every lesson body is 15–80 words (one-sitting micro-lessons)', () => {
    for (const family of JOB_FAMILIES) {
      for (const [skill, lessons] of Object.entries(LESSONS[family])) {
        for (const [kind, body] of Object.entries(lessons)) {
          const label = `${family} / ${skill} / ${kind}`
          expect(wordCount(body), `${label} too long`).toBeLessThanOrEqual(80)
          expect(wordCount(body), `${label} too short`).toBeGreaterThanOrEqual(15)
        }
      }
    }
  })

  it('AC3 — bodies are text strings (no markup or media embedded)', () => {
    for (const family of JOB_FAMILIES) {
      for (const lessons of Object.values(LESSONS[family])) {
        for (const body of Object.values(lessons)) {
          expect(body).not.toMatch(/<[a-z]+|https?:\/\/|\.(mp3|mp4|wav)\b/i)
        }
      }
    }
  })

  it('AC6 — the content gate exists with the explicit states', () => {
    expect(['pending-po-review', 'approved']).toContain(LESSONS_APPROVAL.status)
  })
})
