---
id: US-005
title: Take one practical next step
status: ready
priority: high
---

# US-005 — Take one practical next step

## User Story

As an unemployed adult who has seen my skills map and tried a lesson, I want to
take one practical next step towards work — something I can actually do now,
not a job application — so that I move from learning towards action.

## User Need

- MVP scope step 4 (decision, 2026-10-18): "they take ONE practical next step
  (an action towards work, not a job application)".
- Value proposition promise (`product/product.md`): "get practical help taking
  the first step into work".
- Problem description, Key Challenge 6 (Employment Transition): a gap exists
  between acquiring skills and moving into work.

## Acceptance Criteria

- **AC1 — One practical step offered.** At the end of the journey the resident
  is offered a single practical next step — exactly the 3-sentence work
  introduction decided on 2026-10-18: the resident writes (on paper or in
  phone notes) and then says out loud once (a) who they are, (b) the kind of
  work they are looking for, and (c) 2 skills they saw on their map — one
  clear action, not a list of options.
- **AC2 — Not a job application.** The step is not an application, submission
  or enquiry for a specific real job (job applications are out of MVP scope).
- **AC3 — Clear what, how and why.** The step states concretely, in plain
  English suitable for varied education levels: what — the three sentences
  with the three parts (who they are, kind of work, two skills from their
  map); how — write the sentences down (paper or phone notes), then say them
  out loud once; why — employers and anyone they meet ask "tell me about
  yourself", and having a ready introduction is the first move from learning
  toward action.
- **AC4 — Understandable on a phone.** The step and its instructions can be
  read and understood on a phone screen without horizontal scrolling or
  pinch-zoom.
- **AC5 — Pre-filled from my map.** The step screen pre-fills from the
  resident's map session data — their top job family as the "kind of work"
  example and two skills from their top families as suggested skills — using
  session data only, with no new questions and nothing stored; the resident
  may use their own words.

Note (2026-10-18, PO, via US-006): "session data only / nothing stored"
means the step screen itself stores nothing new and keeps no completion
record — but the underlying answers now persist in browser localStorage per
US-006's decision, so a restored journey can pre-fill the step from that
saved data. AC5's intent is unchanged (no new data collected, no tracking);
literal wording clarified.

## UX / UI

- The step is the closing moment of the journey: one prominent action with
  plain instructions, not a menu. It must feel like something doable today,
  not a redirect to another product.

### Decided Structure (decisions, Product Owner, 2026-10-18)

- **The step = a 3-sentence work introduction.** The resident writes it (on
  paper or in phone notes) and then says it out loud once: (a) who they are,
  (b) the kind of work they are looking for, (c) 2 skills they saw on their
  map. Why it helps: employers and anyone they meet ask "tell me about
  yourself" — having a ready introduction is the first move from learning
  toward action.
- **Placement.** The step is reached from the skills map as the closing
  moment of the journey (Coder decides the exact placement — e.g. a
  prominent closing section or button on the map). The wording of the step
  screen is drafted by the team and approved by the Product Owner at preview,
  consistent with US-003's wording gate pattern — APPROVED as-is 2026-10-18;
  see "Approved wording" below.
- **Personalisation.** The step screen pre-fills from the resident's map
  session data: their top job family as the "kind of work" example and two
  skills from their top families as suggested skills; the resident may use
  their own words. No new questions, no stored data (AC5).
- **Self-contained.** No employment centres, NGOs or programmes are named —
  no verified partner data exists (`product/product.md` Open Question 5
  remains unresolved) and US-002's honesty rule applies. Adding real local
  services later is a new Story.
- **Journey ending.** The step screen is the closing moment: only the
  existing "Start again" button — no "I did it" button, no completion
  tracking (consistent with Out of Scope); the resident leaves when ready.

### Approved wording (approved, Product Owner, 2026-10-18)

As built in `src/components/NextStepView.tsx` and
`src/components/SkillsMap.tsx` — **APPROVED as-is**:

- Map closing card: heading "Ready for your next step?"; line "Take one
  practical step towards work — it takes a few minutes."; button "See my
  practical next step".
- Step screen: eyebrow "Your next step"; H1 "Say your 3-sentence
  introduction".
- Why card: "Employers and people you meet often ask: 'Tell me about
  yourself.' With three short sentences ready, you can answer well. This is
  your first step from learning towards work."
- How: "How: Write these three sentences on a paper or in your phone notes.
  Then read them out loud once."
- Sentence 1: "My name is _______. I live in {area from Q2}."
- Sentence 2: "I am looking for work in {top family, or first considered
  family when none qualifies}."
- Sentence 3: "I am learning skills like {skill 1} and {skill 2}."

Note (observing the approved text, not a new decision): Sentence 2's
placeholder also pins the edge case where the resident qualifies for no
family — the first considered family is used as the example.

**Frozen for the build:** approved wording, like US-002's content and
US-003's approved levels and wording — any change needs a new Product Owner
decision.

## Out of Scope

- Applying to or tracking real job listings.
- Mentoring, coaching or AI-assistant conversations about the step.
- Recording, tracking or verifying completion of the step; any
  completion-marking control such as an "I did it" button (decision,
  2026-10-18).
- Naming real local services (employment centres, NGOs, programmes) — no
  verified partner data exists; a new Story is required to add them
  (decision, 2026-10-18).
- Support journeys for employed residents.

## Open Questions

None — all four open questions were resolved by Product Owner decisions on
2026-10-18 (the step itself; personalisation; external services; journey
ending); see UX / UI → Decided Structure.

## Traceability

- Evidence: `docs/design-thinking/01-problem-description.md` — Key Challenge
  6, employment transition gap (interpretation, unvalidated).
- Decisions (Product Owner, 2026-10-18): MVP scope step 4
  (`product/product.md`); the step is a 3-sentence work introduction the
  resident writes and says out loud once (who they are / kind of work / 2
  skills from their map) — satisfies AC1 (one action), AC2 (not a job
  application) and AC3 (what/how/why); pre-filled from map session data, no
  new questions, no stored data; self-contained — no named external services
  (`product/product.md` OQ5 unresolved; US-002 honesty rule applies; real
  services later = a new Story); journey ends on the step screen with only
  the existing "Start again" button — no completion tracking.
- Hypotheses: **H5** (primary — help beyond training matters for the
  transition into work); boundary with the out-of-scope "job applications"
  decision keeps the MVP slice honest.
- Depends on: US-003 (the map the step grows out of and the session data it
  pre-fills from — AC5); US-002 (honesty rule: nothing resident-facing may
  be presented without a verified source — no services are named in this
  story as a consequence).
- Priority reason: **high** — tests H5, which would otherwise go untested;
  small scope (one action, one screen).
