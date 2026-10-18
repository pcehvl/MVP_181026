---
id: US-004
title: Try short sample lessons for a skill
status: ready
priority: medium
---

# US-004 — Try short sample lessons for a skill

## User Story

As an unemployed adult seeking work with limited data on my phone, I want to
try a few short sample lessons for a skill, in simple English, so that I can
start learning the skill without cost or barriers.

## User Need

- Value proposition promise (`product/product.md`): learn required skills "in
  simple, low-data, mobile-friendly English".
- MVP scope step 3 (decision, 2026-10-18): "they can try a few short sample
  lessons per skill — simple English, low-data, mobile-first".
- User need: "practise skills relevant to real workplace situations";
  affordability and data cost are the access barriers named in the framing.

## Acceptance Criteria

- **AC1 — Two lessons per skill.** Every skill in the skills map links to
  exactly 2 sample lessons following the fixed template: Lesson 1 "What this
  looks at work" (a plain explainer, ≤80 words) and Lesson 2 "Try this" (one
  practical micro-exercise, ≤80 words).
- **AC2 — One-sitting lessons.** Every lesson can be started and finished in
  one continuous session on a phone; the two lessons together never exceed
  ~160 words per skill and take roughly 3 minutes end to end.
- **AC3 — Simple plain English.** Lesson content is written in short, plain
  English suitable for varied education levels, with no unexplained jargon;
  the same lesson text is shown to every resident (no per-resident versions).
- **AC4 — No large downloads.** A lesson can be completed on a slow or limited
  mobile connection without requiring video, recorded audio or other large
  media downloads.
- **AC5 — Read-aloud where supported.** Where the device supports it, each
  lesson offers a "Read aloud" control that speaks the lesson text using the
  phone's built-in voice with no audio download; where the device does not
  support it, the control is not shown and the lesson remains fully usable as
  text.
- **AC6 — No lessons before approval.** No lesson is visible to residents
  until the Product Owner has reviewed and approved the full set of 108
  micro-lessons in a single review round; unapproved lesson content is not
  shown (content gate as in US-002 / US-003).

## UX / UI

- Lessons are reached from the skill they belong to in the map (US-003), so
  the resident never has to search for them.
- Text-first presentation, minimal imagery, and each lesson shows which skill
  and which jobs it belongs to, keeping learning connected to employment.

### Decided Structure (decisions, Product Owner, 2026-10-18)

- **Template: exactly 2 lessons per skill.** Lesson 1 "What this looks at
  work" — plain explainer, ≤80 words. Lesson 2 "Try this" — one practical
  micro-exercise, ≤80 words. Both finishable in one sitting, ~3 minutes
  total; never more than ~160 words per skill. Total content: 54 skills × 2 =
  108 micro-lessons (~7,500 words).
- **Format: text + Read aloud.** Text-first, with a "Read aloud" button that
  uses the phone's built-in voice (Web Speech API — zero data cost), shown
  where the device supports it; the fallback is simply no button. No recorded
  audio, no audio files.
- **Content gate (same pattern as US-002 / US-003).** The team drafts all 108
  lessons; the Product Owner reviews the full set in one review round before
  any lesson is visible to residents; city partners validate after the
  bootcamp. This spec states the gate requirement (AC6); the implementation
  pattern (content-approval flag or reuse) is the Coder's choice.
- **Literacy: uniform plain English for the MVP.** No per-resident lesson
  versions; the Read-aloud button is the literacy aid (see Traceability for
  how this maps to H3).
- **Slim lever exercised.** 2 lessons per skill is the decided scope, not a
  future cut: the "fewer lessons per skill" contingency noted in the original
  priority rationale is spent; any further slimming needs a new Product Owner
  decision.

## Out of Scope

- Full courses, certifications or accredited programmes.
- Video-based content, offline saving of lessons.
- Adaptive difficulty engines or AI-generated content (AI conversations are
  out of MVP scope).
- Per-resident or literacy-level-specific lesson versions (uniform text —
  decision, 2026-10-18); recorded audio or audio files (Read aloud uses the
  device voice only).
- Content in languages other than English.

## Open Questions

None — all four open questions were resolved by Product Owner decisions on
2026-10-18 (lessons per skill and length; format; authoring and approval;
literacy adaptation); see UX / UI → Decided Structure.

## Traceability

- Evidence: none yet (no primary research — `product/product.md`); content
  rests on interpretations pending resident testing after the bootcamp.
- Decisions (Product Owner, 2026-10-18): MVP scope step 3
  (`product/product.md`); exactly 2 lessons per skill via a fixed template
  (≤80 words each, ~160 words per skill ceiling, ~3 minutes; 108
  micro-lessons total); format = text + Read-aloud via the device's built-in
  voice (Web Speech API, no-button fallback, no audio files); content gate =
  same as US-002 / US-003 (team drafts all 108, PO reviews the full set in
  one round before any lesson is visible, partners validate later); uniform
  simple English, no per-resident versions.
- Hypotheses: **H3** — H3's "adapts to literacy level" promise is tested in
  the MVP through its testable interpretation: uniform plain language plus
  the read-aloud aid, NOT per-resident adaptation (interpretation recorded
  honestly, 2026-10-18; full adaptation deferred to post-bootcamp learning).
  H4 (practical relevance drives engagement) gets incidental signal, though
  H4 is not in the MVP's must-test set.
- Depends on: US-003 (skills to attach lessons to); US-002 (plain-language
  provenance standard and the content-gate pattern reused here).
- Priority reason: **medium** — tests H3, but H3 is also carried by the
  plain-language, personalised framing of US-001 and US-003; scope is now
  fixed at 108 micro-lessons (decision, 2026-10-18) and any further slimming
  needs a new Product Owner decision.
