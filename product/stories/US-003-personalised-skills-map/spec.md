---
id: US-003
title: See my personalised skills map
status: ready
priority: high
---

# US-003 — See my personalised skills map

## User Story

As an unemployed adult seeking work, I want to see a personalised skills map —
the skills local employers demand for the jobs I qualify for, each with a
plain "why this matters" — so that I know which skills to focus on.

## User Need

- `product/product.md` user need: "identify which skills they need to improve
  their employment prospects" — the core relevance gap in the problem
  description (Key Challenge 2).
- MVP scope step 2 (decision, 2026-10-18): "they see a personalised skills map
  — which skills local employers demand for jobs they qualify for, with a
  plain 'why this matters'".
- Value proposition promise: "know exactly which skills local employers need"
  — the story that carries hypothesis H1.

## Acceptance Criteria

- **AC1 — Personalised from my answers.** The skills map is personalised from
  the resident's US-001 answers: which job families are shown is determined by
  their Q1 (qualification) answer and Q3 (work-interest) selection — with
  "Not sure" or a skipped Q3 counting as all families — and changing those
  answers changes which families and skills appear.
- **AC2 — Qualifying job families with skills.** The map shows the job
  families the resident qualifies for and, for each of them, the skills
  demanded, taken from the curated content (US-002).
- **AC3 — Why this matters shown.** Every skill listed in the map is shown
  with a short plain-English "why this matters" explanation.
- **AC4 — Readable on a phone.** The map is readable and navigable on a phone
  screen without horizontal scrolling or pinch-zoom.
- **AC5 — Sample-data notice visible.** The map displays a clear notice that
  the skills data is curated sample content, not live employer data (US-002).
- **AC6 — Minimum-qualification rule.** Each seeded job family (US-002)
  declares a minimum qualification level; the resident qualifies for a family
  when their Q1 answer meets that level and the family is in their Q3
  selection — with "Not sure" or a skipped Q3 counting as all families
  (US-001).
- **AC7 — Area echoed, display only.** The map echoes the resident's Q2 area
  back at the top (e.g. "Work we will look at near <area>"); the area answer
  is used only for display and never changes which families or skills are
  shown or their order.
- **AC8 — Near-misses shown separately.** Selected job families the resident
  does not qualify for are shown in a separate near-miss section at the
  bottom of the map, one plain-language line each, not mixed in with the
  qualifying families.
- **AC9 — Near-misses capped with count line.** The near-miss section shows
  at most 2 entries, each a single line; when the resident selected more than
  2 non-qualifying families, one additional plain count line states how many
  more of their choices don't match yet (e.g. "2 more of your choices don't
  match yet"), so nothing is silently dropped.
- **AC10 — Top three in content order.** The top 3 qualifying job families
  are the first 3 qualifying families in seeded content order (the order of
  the nine families in `src/lib/job-families.ts`); they are shown in that
  order, and qualifying families beyond those first 3 are not shown in the
  MVP. The order is content order, explicitly not a demand-based ranking.
- **AC11 — Six skills per family.** Each qualifying family section lists the
  6 skills defined for that family in the curated content (US-002).

Change notes (2026-10-18): AC1 reworded — personalisation is driven by Q1 and
Q3 only, with Q2 display-only (see AC7); AC2 changed "jobs" to "job families"
to match the decided family-level structure (see AC6). IDs unchanged; no
renumbering; new criteria continue at AC6.

Change notes (2026-10-18, second pass): AC9 reworded — cap of 2 plus one
honest count line for overflow (decision); AC10 made deterministic against
seeded content order (decision). IDs unchanged; no renumbering.

## UX / UI

- The map is the hero moment of the journey: the resident should recognise
  "this is about me and my jobs" at a glance, using short sections and plain
  language rather than dense tables.
- Skills connect onward to their sample lessons (US-004); that continuation is
  verified end-to-end in US-006.

### Decided Structure (decisions, Product Owner, 2026-10-18)

- **Ranked vertical list, phone-first — not a geographic map.** Qualifying
  job families appear as sections top-to-bottom; under each, its skills, each
  with its per-skill "why this matters" taken from US-002's approved reasons.
  No per-family intro layer.
- **Qualification rule.** Each of the nine seeded job families declares a
  minimum qualification level, drafted by the project team and approved by
  the Product Owner during content review; no rule or level is used in any
  resident-facing view before approval (content gate consistent with US-002).
  The resident qualifies when their Q1 answer meets the family's level AND
  the family is in their Q3 selection ("Not sure"/skip = all families, per
  US-001). Levels APPROVED as-is by the Product Owner (2026-10-18) — see
  "Approved content gate" below — and frozen for the build.
- **Q2 (area): display only.** Echoed back at the top of the map (e.g. "Work
  we will look at near <area>"); never used for matching or ordering —
  deliberate honesty decision: no location-to-jobs data exists.
- **Size limits.** Top 3 qualifying job families; 6 skills per family (the
  content defines exactly 6); near-misses capped at 2 entries, one line each,
  plus one honest count line for any remaining near-misses (decision,
  2026-10-18). **Qualifying families beyond the top 3 are not shown in the
  MVP** — stated explicitly here as a scope limit.
- **Ordering (decision, 2026-10-18).** Families appear in seeded content
  order — the order of the nine families in the job-families content source
  (`src/lib/job-families.ts`) — and the top 3 are simply the first 3
  qualifying families in that order; skills appear in approved content order
  (skills content source, `src/lib/skills-content.ts`). Stable and
  deterministic — explicitly NOT a demand-based ranking (honesty rationale:
  no employer-demand data exists to rank by).
- **Near-miss section.** Selected families whose qualification level the
  resident does not meet appear at the bottom in their own section with a
  plain message — never silently dropped, never a dead end; overflow beyond
  2 is acknowledged with one honest count line (AC9). Message wording
  APPROVED (see "Approved content gate" below).

### Approved content gate (approved, Product Owner, 2026-10-18)

Minimum-qualification levels per job family — **APPROVED as-is**
(implementation: `src/lib/matching.ts`, `MIN_QUALIFICATION`):

| Minimum qualification level | Job families |
|---|---|
| No schooling | Cleaning · Building and manual work · Cooking and food work |
| Some primary school | Hair and beauty · Caregiving |
| Finished primary school | Retail and shops · Driving and delivery |
| Some high school | Office and admin work · Working with computers |

Resident-facing wording — **APPROVED as-is**
(implementation: `src/components/SkillsMap.tsx`):

- Near-miss line (AC8): "<Family> — most employers here ask for more
  schooling than your answers show. With more schooling this could open up
  for you."
- Overflow count line (AC9): "N more of your choices don't match yet."
- Top-3 count line (AC10): "Showing 3 of N kinds of work that fit your
  answers." — also resolves "does the map tell residents about the top-3
  limit": yes.

**Frozen for the build:** the approved levels and wording are approved
content, like US-002's — any change needs a new Product Owner decision.

## Out of Scope

- Job listings, applications or tracking.
- Live employer data (curated content only — US-002).
- Content or paths aimed at employed residents (deferred segment).
- A geographic or map-like visualisation of areas or jobs (the map is a
  ranked vertical list — decision, 2026-10-18); no location-to-jobs data
  exists.
- Per-family introduction or summary layers above the skill lists
  ("why this matters" is per-skill only — decision, 2026-10-18).
- Showing qualifying job families beyond the top 3 (MVP size limit —
  decision, 2026-10-18).

## Open Questions

None — the last open item (resident-facing wording: the near-miss message,
the overflow count line, and whether the map states the top-3 limit) was
resolved by Product Owner approval on 2026-10-18; see UX / UI → Approved
content gate.

## Traceability

- Evidence: `docs/design-thinking/01-problem-description.md` — relevance
  challenge; "residents struggle to identify which skills they need"
  (hypothesis label in `product/product.md`).
- Decisions (Product Owner, 2026-10-18): MVP scope step 2
  (`product/product.md`); honest labelling of seeded data (see US-002);
  "qualifies" = per-family minimum qualification level, drafted by the project
  team and approved by the Product Owner during content review (consistent
  with US-002's content gate), resident qualifies via Q1 + Q3 with
  skip/"Not sure" = all families; Q2 (area) echoed on the map for display
  only, never matching or ordering (honesty: no location-to-jobs data);
  visual structure = ranked vertical list, phone-first, not a geographic map;
  size limits = top 3 qualifying families, 6 skills per family, near-misses
  capped at 2 one-line entries plus one honest count line for the rest
  (decision, 2026-10-18), families beyond the top 3 not shown in the MVP
  (stated explicitly); ordering = seeded content order (job families:
  `src/lib/job-families.ts`, skills: `src/lib/skills-content.ts`), top 3 =
  first 3 qualifying families in that order, explicitly not a demand-based
  ranking (decision, 2026-10-18); "why this matters" per-skill only, reusing
  US-002's approved per-skill reasons, no per-family intro layer. The seed
  count is nine job families, named in US-002's AC3 (Product Owner,
  2026-10-18). Minimum-qualification levels (per family) and the
  resident-facing wording (near-miss line, overflow count line, top-3 count
  line) APPROVED as-is and frozen for the build (approval, Product Owner,
  2026-10-18 — UX / UI → Approved content gate).
- Hypotheses: **H1** (primary — skill-gap visibility motivates action);
  **H3** (secondary — relevance derived from the resident's answers).
- Depends on: US-001 (Q1 and Q3 drive matching — AC6; Q2 echo — AC7; skip =
  "Not sure" — AC1/AC6), US-002 (labelled curated content — AC2/AC5,
  per-skill "why this matters" — AC3, approved minimum-qualification levels —
  AC6, six skills per family — AC11).
- Priority reason: **high** — carries H1, the central and riskiest hypothesis;
  the MVP exists chiefly to show this screen.
