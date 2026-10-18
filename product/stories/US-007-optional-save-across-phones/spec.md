---
id: US-007
title: Save my journey across phones (optional)
status: ready
priority: high
---

# US-007 — Save my journey across phones (optional)

## User Story

As an unemployed adult who tried the journey on a borrowed or shared phone, I
want to optionally sign in — only if I choose, after the journey or on
return — so that my saved map and my 3-sentence introduction are available on
any phone I sign in on, and switching phones doesn't lose my journey.

## User Need

- Post-deployment Product Owner decision (2026-10-18), after the US-001–US-006
  MVP was deployed: an optional "save-across-phones" capability. Profile =
  the resident's saved map/answers + the generated 3-sentence introduction
  (refined 2026-10-18: nothing else — no lesson-open history; see Decided
  Structure).
- The journey currently persists only in the browser's localStorage
  (US-006 AC5) — it dies with the device. Premise: this segment borrows or
  shares phones. **Assumption (unvalidated)** — resident testing of the
  zero-barrier MVP has not happened yet.
- Zero barrier at first use (decision, 2026-10-18): the current signed-out
  journey stays exactly as it is; sign-in is never required.

## Acceptance Criteria

- **AC1 — Sign-in never required.** The full journey — intake, skills map,
  sample lessons and the 3-sentence step — can be started, completed and
  resumed with no account and no sign-in, behaving exactly as deployed;
  signing in is only ever an optional offer.
- **AC2 — Optional save on sign-in.** When a resident signs in by email
  magic link (Supabase passwordless email), their intake answers are saved
  to their account so the journey is no longer tied to one device; declining
  the offer leaves the journey exactly as it is (local save per US-006 AC5).
- **AC3 — Restored on any phone.** When a resident signs in on a different
  phone (after that phone's three intake questions, at the map prompt or the
  end-of-journey offer), their saved journey loads — the skills map and the
  3-sentence introduction recomputed from their saved answers, with the
  sample lessons and the step reachable from there; where fresh local answers
  also exist, the resident is offered their saved answers instead.
- **AC4 — Profile contents, minimal.** The server stores exactly the
  resident's identifier, their intake answers and timestamps; from those the
  personalised map (families and skills) and the 3-sentence introduction are
  recomputed, never stored separately. Nothing else is part of the profile —
  no lesson-open history, no completion tracking, no editable introduction
  (the no-tracking position of US-005/US-006 stands; reversal explicitly not
  taken).
- **AC5 — Own data only.** A signed-in resident can read and write only
  their own saved profile; this is enforced by database row-level security,
  not by the app alone.
- **AC6 — No secrets in browser.** No privileged credentials appear in the
  browser bundle or its public configuration; only public client-side values
  ship.
- **AC7 — Self-serve permanent deletion.** A signed-in resident can choose
  "Delete my account and data": one confirmation deletes their authentication
  account and their saved profile row and wipes the local save on that
  device; the deletion is permanent and needs no support contact.

## UX / UI

- The offer is an invitation, never a gate: plain wording (e.g. "Keep my
  journey on any phone"), a one-tap decline that loses nothing now, no
  pre-ticked consent and no scare copy. Any sign-in flow stays low-data,
  phone-first and in plain English, consistent with US-001–US-006.
- Honest wording: state plainly what is saved, that it belongs to the
  resident and is private to them, and how to delete it (self-serve — see
  Decided Structure).

### Decided Structure (decisions, Product Owner, 2026-10-18)

- **Sign-in method: email magic link only** (Supabase Auth passwordless
  email). Known trade-off, accepted by the Product Owner: Supabase's shared
  SMTP is rate-limited and email reach among the target group is imperfect —
  acceptable for MVP / free-tier scale; phone OTP or custom SMTP are future
  stories if resident testing demands it. Setup: no provider config beyond
  the Supabase project (free tier); no paid SMTP authorised.
- **Two offer touchpoints:** (a) the main optional offer after the practical
  next step (end of journey); (b) a small optional "keep my journey" prompt
  on the map on return. The Question 1 screen stays byte-for-byte unchanged
  (zero-barrier evidence base — AC1).
- **Cross-phone flow:** new phone → 3 intake questions → sign in at the map
  prompt → saved journey loads, with an offer to use the saved answers over
  the fresh local ones.
- **Profile contents:** saved intake answers → recomputed personalised map
  (families, skills) + recomputed 3-sentence introduction. Nothing else — no
  lesson-open history, no completion tracking, no editable introduction; the
  no-tracking reversal was explicitly not taken (schema stays AC4-minimal).
- **Deletion:** "Delete my account and data" — one confirmation deletes the
  Supabase authentication account, the profile row and the local save on
  that device; permanent, self-serve (AC7).
- **Cost:** Supabase free tier + Vercel free tier only; no paid services
  authorised by this story (no paid SMTP, no SMS).

## Constraints

- First use of a backend in this product: Supabase (Auth + Postgres + RLS)
  is the chosen stack (`AGENTS.md`), never used until now because no
  requirement needed it. **Human setup actions required before
  implementation: a Supabase project must be created and the Supabase CLI
  must be installed — neither exists today.**
- Harness rules that bind this story: auth/RLS/data-access work is PLAN-AGENT
  (Planner + full security review + full `npm run verify`) — never FAST; no
  secrets in the browser bundle; RLS must enforce own-data-only; keep the
  synced schema the smallest that fits (AC4).
- Cost posture (decision, 2026-10-18): Supabase free tier + Vercel free
  tier only — no paid services are authorised by this story (no paid SMTP,
  no SMS).

## Out of Scope

- Making sign-in required for any part of the journey (zero-barrier
  regression — explicitly excluded).
- Social, sharing or mentor features.
- Real-time multi-device sync or conflict resolution beyond restoring the
  latest saved profile.
- Server-side copies of lesson content or "why this matters" text (content
  stays in the frontend; the profile stores answers only — AC4).
- Admin tooling or account management beyond the resident's own controls.
- Paid services of any kind (decision, 2026-10-18): Supabase and Vercel
  free tiers only — no paid SMTP, no SMS.

## Open Questions

None — all five open questions were resolved by Product Owner decisions on
2026-10-18 (sign-in method; offer placement; profile contents; deletion;
cost posture); see UX / UI → Decided Structure.

## Traceability

- Trigger: post-deployment Product Owner decision (2026-10-18), after the
  US-001–US-006 MVP went to production. A new optional capability, not a
  change to the deployed journey.
- Evidence label: the borrowed/shared-phone premise is an **assumption** —
  resident testing of the MVP has not happened yet (`product/product.md`
  validation plan); no resident evidence exists for or against this feature.
- Decisions (Product Owner, 2026-10-18): optional save-across-phones;
  never-required sign-in with the signed-out journey unchanged (Question 1
  screen byte-for-byte unchanged); sign-in method = email magic link only
  (Supabase Auth passwordless), two offer touchpoints (end of journey + map
  prompt on return); profile = saved intake answers → recomputed map +
  recomputed 3-sentence introduction, nothing else (no lesson history, no
  tracking, no editable introduction — no-tracking reversal explicitly not
  taken); self-serve permanent deletion (account + profile row + local
  wipe — AC7); Supabase Auth + Postgres + RLS as the backend — its first use
  in this product; Supabase + Vercel free tiers only, no paid services.
- Honest trade-offs recorded (2026-10-18): the magic-link flow relies on
  Supabase's shared SMTP (rate-limited) and email reach among the target
  group is imperfect — accepted at MVP/free-tier scale, resident evidence
  pending; if resident testing shows this is a real barrier, phone OTP or
  custom SMTP becomes a new Story.
- H6 integrity (tension recorded honestly): resident testing of the
  zero-barrier MVP has not happened yet; this story must not regress the
  barrier. AC1/AC2 keep signed-out use fully functional so H6 evidence stays
  clean — the optional account must never become a de facto requirement.
- Supersedes in part: US-006's "no account, no sign-in / no server sync"
  position (2026-10-18) — a dated supersession note has been added to
  US-006's spec; US-006's signed-out journey, localStorage persistence and
  "Start again" wipe are unchanged.
- Depends on: US-001 (intake answers are the synced payload — AC4), US-003
  (map recomputed from answers), US-005 (introduction generated from
  answers), US-006 (local save remains the signed-out persistence the offer
  sits alongside).
- Priority reason: **high** — Product Owner-requested post-deployment
  addition, to be built alongside (never ahead of) resident testing of the
  zero-barrier journey; AC1 protects the evidence base.
