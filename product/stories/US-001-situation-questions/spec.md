---
id: US-001
title: Answer a few questions about my situation
status: ready
priority: high
---

# US-001 — Answer a few questions about my situation

## User Story

As an unemployed adult seeking work in Cape Town, I want to answer a few short
questions about my situation — my education, my area or interests, and my
experience — so that what I see next is relevant to where I am today.

## User Need

- `product/product.md` user needs: "identify which skills they need to improve
  their employment prospects" and "learn in a personalized way that accounts
  for education level, language and digital literacy".
- MVP scope step 1 (decision, 2026-10-18): "a resident answers a few questions
  about their situation (education, area/interests, experience)".
- Without answers about the resident, the personalised skills map (US-003) has
  nothing to personalise.

## Acceptance Criteria

- **AC1 — Three situation areas covered.** The intake covers the three areas
  decided for the MVP: education, area/interests, and experience.
- **AC2 — Plain language questions.** Every question and answer option is
  written in short, plain English suitable for adults with varied education
  levels.
- **AC3 — Phone completion without zoom.** The full intake can be completed on
  a phone screen without horizontal scrolling or pinch-zoom.
- **AC4 — Flows into the skills map.** After the final question, the resident
  is taken directly to the personalised skills map (US-003).
- **AC5 — Exactly three decided questions.** The intake asks exactly the three
  questions listed in "Decided Intake" under UX / UI, in that order, with the
  decided answer types and options.
- **AC6 — Required questions enforced.** The resident cannot proceed past Q1
  (qualification) or Q2 (area) without an answer; Q3 (work interest) may be
  skipped without blocking progress, and a skip has exactly the same effect
  as choosing "Not sure" (AC7).
- **AC7 — Not sure or skip shows all families.** If the resident chooses
  "Not sure" on Q3 or skips Q3 entirely, the journey continues with all
  seeded job families (US-002) considered in the skills map.
- **AC8 — Options match seeded families.** The job-family options offered in
  Q3 are exactly the job families seeded in US-002, plus the "Not sure"
  option.

## UX / UI

The intake must feel short and low-effort: three questions, quickly answerable
on a phone.

### Decided Intake (decision, Product Owner, 2026-10-18)

- **Q1 — "What is the highest school qualification you have?"** Single-select:
  No schooling · Some primary school · Finished primary school · Some high
  school · Matric (finished high school) · Trade course or other
  qualification. **Required.**
- **Q2 — "Which area do you live in?"** Free-text field with suggestions
  (e.g. Khayelitsha, Mitchells Plain). **Required.**
- **Q3 — "Which kind of work are you interested in, or have you done
  before?"** Multi-select of job families, which must match the seeded job
  families in US-002, plus a "Not sure" option that results in all job
  families being shown. **Optional** — can be skipped; "Not sure" is also a
  valid explicit choice. Skipping Q3 (proceeding without answering and
  without choosing "Not sure") behaves exactly like choosing "Not sure": all
  seeded job families are considered (decision, 2026-10-18).

Rationale (decisions, Product Owner, 2026-10-18): exactly three questions,
respecting the resident's time and data and serving H6; no explicit
literacy/digital-literacy question in the MVP — education level is the
accepted proxy for a 4-day build, with H3 adaptation beyond this deferred to
post-bootcamp learning.

## Out of Scope

- Questions beyond the three decided questions (see Decided Intake).
- Account creation, sign-in, or saving answers across sessions — decided
  session-only for the MVP (decision, 2026-10-18); US-006 still carries the
  open question on any entry gate.
  - **Partially superseded 2026-10-18 (PO):** the session-only part was
    reversed by US-006 — answers now persist in the browser; see the
    supersession note under Traceability. The account/sign-in exclusion
    stands (US-006 decision: no account, no sign-in).
- Languages other than English.

## Open Questions

- What downstream role does the area answer (Q2) play — does it influence the
  personalised skills map (US-003) or the practical next step (US-005), or is
  it collected only for context? The framing records the area question but no
  defined use; a required answer with no visible effect may need a stated
  purpose for the resident.

## Traceability

- Evidence: `docs/design-thinking/01-problem-description.md` — "many residents
  struggle to identify which skills they need" (labelled hypothesis in
  `product/product.md`, not evidence).
- Decisions (Product Owner, 2026-10-18): MVP scope step 1
  (`product/product.md`); exactly three intake questions as specified in
  Decided Intake (wording, answer types, options, required/optional rules);
  "Not sure" on Q3 shows all seeded job families, and a skipped Q3 behaves
  exactly like "Not sure" (decision, 2026-10-18); education level is the
  accepted literacy/digital-literacy proxy for the MVP (H3 adaptation beyond
  this deferred to post-bootcamp learning); answers live for the current
  session only (cross-ref US-006).
- Hypotheses: H3 (personalisation starts from answers about the resident);
  contributes to H6 (three quick questions on a phone is the resident's first
  interaction with a digital tool).
- **Supersession (2026-10-18):** Superseded on 2026-10-18 by US-006 (PO
  decision): answers are persisted in browser localStorage; Start again wipes
  them. Original session-only decision (2026-10-18) reversed by the same
  human. The session-only wording in Out of Scope and in the Decisions bullet
  above is kept as the record of the original decision.
- Depends on: US-002 (Q3 options must match its seeded job families — AC8)
  and US-003 ("Not sure" or skip must result in all job families being shown
  — AC7).
- Priority reason: **high** — first step of the one journey; every later story
  depends on these answers.
