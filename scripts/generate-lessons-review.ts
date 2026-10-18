import { writeFileSync } from 'node:fs'
import { JOB_FAMILIES } from '../src/lib/job-families'
import { LESSONS } from '../src/lib/lessons-content'
import { SKILLS_CONTENT } from '../src/lib/skills-content'

/**
 * Generates docs/us-004-lessons-review.md — the Product Owner's review
 * snapshot of all 108 sample lessons (US-004 AC6 content gate).
 *
 * The source of truth is src/lib/lessons-content.ts; this file is a
 * read-only snapshot for one review round. Regenerate with:
 *
 *   npx vite-node scripts/generate-lessons-review.ts
 *
 * Run from the repo root. Requires the lessons content to be complete.
 */

const wordCount = (text: string): number => text.trim().split(/\s+/).length

let out = `# US-004 — Sample lessons: Product Owner review snapshot

> Generated from \`src/lib/lessons-content.ts\` (the source of truth).
> Regenerate after any content change. This file is for review only —
> do not edit it; requested changes go back into the source file.
>
> Review ask: read all 108 lessons (9 families x 6 skills x 2 lessons).
> Reply **approved** to switch the lessons on, or list changes by
> family / skill / lesson.

| | |
|---|---|
| Total lessons | 108 |
| Per skill | "What this looks at work" (≤80 words) + "Try this" (≤80 words) |
| Gate | No lesson is visible in the app until this set is approved (AC6) |
`

let total = 0
for (const family of JOB_FAMILIES) {
  out += `\n---\n\n## ${family}\n`
  for (const skill of SKILLS_CONTENT[family].skills) {
    const lessons = LESSONS[family][skill.name]
    out += `\n### ${skill.name}\n\n`
    out += `**What this looks at work** (${wordCount(lessons.explainer)} words)\n\n${lessons.explainer}\n\n`
    out += `**Try this** (${wordCount(lessons.practice)} words)\n\n${lessons.practice}\n`
    total += 2
  }
}

out = out.replace('| Total lessons | 108 |', `| Total lessons | ${total} |`)
out += `\n---\n\n_End of snapshot — ${total} lessons reviewed source: \`src/lib/lessons-content.ts\`._\n`

writeFileSync('docs/us-004-lessons-review.md', out, 'utf8')
console.log(`Wrote docs/us-004-lessons-review.md (${total} lessons)`)
