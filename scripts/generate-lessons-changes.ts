import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Compares the Product Owner's approved snapshot (path in argv[2]) with the
 * current docs/us-004-lessons-review.md and writes
 * docs/us-004-lessons-changes.md listing only the lessons whose text changed
 * (US-004 AC6 evidence discipline: the PO approves the exact shipped text).
 *
 *   npx vite-node scripts/generate-lessons-changes.ts <approved-snapshot.md>
 */

const oldPath = process.argv[2]
if (!oldPath) throw new Error('Usage: npx vite-node scripts/generate-lessons-changes.ts <approved-snapshot.md>')

interface LessonBlock {
  family: string
  text: string
  counts: number[]
}

function parse(md: string): Map<string, LessonBlock> {
  const map = new Map<string, LessonBlock>()
  const families = md.split(/\n## /).slice(1)
  for (const familyBlock of families) {
    const nl = familyBlock.indexOf('\n')
    const family = familyBlock.slice(0, nl).trim()
    const skills = familyBlock.slice(nl).split(/\n### /).slice(1)
    for (const skillBlock of skills) {
      const skillNl = skillBlock.indexOf('\n')
      const skill = skillBlock.slice(0, skillNl).trim()
      const body = skillBlock.slice(skillNl)
      const counts = [...body.matchAll(/\((\d+) words\)/g)].map((m) => Number(m[1]))
      map.set(skill, {
        family,
        text: body.replace(/\s+/g, ' ').trim(),
        counts,
      })
    }
  }
  return map
}

const approved = parse(readFileSync(oldPath, 'utf8'))
const current = parse(readFileSync('docs/us-004-lessons-review.md', 'utf8'))

const changed: Array<{ skill: string; block: LessonBlock; old: LessonBlock }> = []
for (const [skill, block] of current) {
  const old = approved.get(skill)
  if (!old || old.text !== block.text) {
    changed.push({ skill, block, old: old ?? { family: block.family, text: '', counts: [] } })
  }
}

let out = `# US-004 — lessons changed after your review snapshot

> The drafting pass finished **after** your approved snapshot was generated
> and lengthened some lessons to meet the minimum-word floor. Full current
> text is in \`docs/us-004-lessons-review.md\` (regenerated). This file lists
> only what differs, so you can re-check precisely what changed.
>
> Changed lessons: **${changed.length} of ${current.size}**

| Job family | Skill | "What this looks at work" | "Try this" |
|---|---|---|---|
`
for (const { skill, block, old } of changed) {
  const fmt = (i: number) =>
    old.counts[i] === block.counts[i]
      ? `${block.counts[i]} words (unchanged)`
      : `${old.counts[i] ?? '—'} → ${block.counts[i]} words`
  out += `| ${block.family} | ${skill} | ${fmt(0)} | ${fmt(1)} |\n`
}
out += `\n_Approved snapshot: \`${oldPath}\` · Current source of truth: \`src/lib/lessons-content.ts\`._\n`

writeFileSync('docs/us-004-lessons-changes.md', out, 'utf8')
console.log(`Changed lessons: ${changed.length} of ${current.size}`)
