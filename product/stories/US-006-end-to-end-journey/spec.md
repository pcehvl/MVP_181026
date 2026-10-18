---
id: US-006
title: Complete the whole journey on my phone
status: ready
priority: high
---

# US-006 — Complete the whole journey on my phone

## User Story

As an unemployed adult with a low-cost smartphone and limited data, I want to
go from the first question to my practical next step in one continuous, free
flow on my phone, so that nothing stops me from trying it.

## User Need

- MVP scope decision (`product/product.md`, 2026-10-18): the four steps are
  "the smallest slice that tests the riskiest hypotheses (H1, H3, H5, H6) in
  one journey" — the journey itself is the product.
- Constraints: mobile-first and data-light delivery; effectively free at the
  point of use (financial constraints are the problem being addressed).
- Accessibility is a core requirement: varied education levels, low digital
  literacy, mobile-only access.

## Acceptance Criteria

- **AC1 — One continuous flow.** A resident can move from the first intake
  question through the skills map and sample lessons to the practical next
  step in one continuous flow — in a single sitting or resumed after an
  interruption (AC5) — with each step leading directly to the next.
- **AC2 — Answers carry through.** Information the resident gives in one step
  is used in the following steps without them re-entering it.
- **AC3 — Free to complete.** The full journey can be started and completed
  without any payment.
- **AC4 — Low-data throughout.** The whole journey works on a slow or limited
  mobile data connection: no step requires video or large downloads.
- **AC5 — Saved, restored, wiped by Start again.** The resident's answers are
  saved in the browser on their device only (no server, never sent anywhere);
  if they abandon the journey and return later, it is restored from that save
  — answers intact, back at the skills map, with the sample lessons and the
  practical next step reachable from there; choosing "Start again" wipes the
  saved data.

## UX / UI

- The resident should always know where they are in the journey (questions →
  skills map → lessons → next step) and what one action moves them forward.
- Nothing stands between opening the tool and seeing value: no setup,
  configuration or payment before the first screen of the intake.

### Decided Structure (decisions, Product Owner, 2026-10-18)

- **Entry: no account, no sign-in.** No setup, configuration or payment
  before the first intake screen; free throughout (`product/product.md`
  decisions + US-001; resolves the entry question from existing decisions).
- **Persistence (supersedes US-001's session-only choice).** Answers are
  saved locally in the browser (localStorage) so an interrupted resident
  (battery dies, data drops, tab closes) returns later and the journey is
  restored. "Start again" wipes the saved data — the resident's honesty
  control over data left on a shared phone. Privacy implication acknowledged
  by the Product Owner: data lives on the device only, never leaves it, no
  server.
- **Device baseline.** Promised: low-cost Android phones (last ~5 years)
  with Chrome, screens down to 320px, slow connections; desktop Chrome/Edge
  for partner demos; iPhone Safari best-effort; very old browsers get
  graceful plain-text degradation (e.g. the Read-aloud button hides where
  unsupported — US-004 AC5).
- **Abandon + return.** Returning residents find their journey restored from
  the local save. Smallest honest slice: restore answers, land on the map,
  lessons and next step reachable from there in one tap — exact UX is the
  Coder's plan.

## Out of Scope

- Native mobile apps, offline mode.
- Production hardening including real auth (per MVP out-of-scope); the MVP
  has no account or sign-in, and persistence is browser-local only — no
  server sync (decision, 2026-10-18).
  - **Superseded in part 2026-10-18 (PO):** an OPTIONAL account feature now
    exists (US-007) — residents may sign in after the journey or on return
    to keep their map and introduction across phones. The
    never-required-sign-in position stands (US-007 AC1); this story's
    signed-out journey, localStorage persistence and "Start again" wipe are
    unchanged.
- Support for employed residents; non-English languages.

## Open Questions

None — all four open questions were resolved by Product Owner decisions on
2026-10-18 (entry; persistence/interruptions; device baseline; abandon and
return); see UX / UI → Decided Structure.

## Traceability

- Evidence: none yet — H6 ("a digital solution is appropriate at all") and the
  mobile/data assumptions remain unvalidated interpretations
  (`product/product.md`, Assumptions and Constraints).
- Decisions (Product Owner, 2026-10-18): one-journey MVP slice; free at point
  of use; mobile-first, data-light; real auth out of MVP scope
  (`product/product.md`); entry with no account, sign-in, setup or payment;
  answers persisted in browser localStorage (device-only, no server) with
  restore-on-return and a "Start again" wipe as the resident's honesty
  control — **this supersedes US-001's session-only decision of the same
  date, reversed by the same human (dated note added to US-001's spec)**;
  device baseline = low-cost Android/Chrome (~5 years), 320px screens, slow
  connections, desktop Chrome/Edge for partner demos, iPhone Safari
  best-effort, graceful plain-text degradation elsewhere; abandon + return =
  smallest honest slice (restore answers, land on the map, one tap to
  lessons and next step).
- **Supersession (2026-10-18):** superseded in part on 2026-10-18 by US-007
  (PO decision): an optional account feature now exists — residents may sign
  in after the journey or on return to keep their map and introduction across
  phones. The never-required-sign-in position stands (US-007 AC1); this
  story's signed-out journey, localStorage persistence and "Start again" wipe
  are unchanged.
- Hypotheses: **H6** primary (the target group can and will use a digital
  tool); also the surface on which H1/H3/H5 testing actually happens — during
  the bootcamp via partner/stakeholder walkthroughs, with residents after.
- Depends on: US-001–US-005 (integrates the full slice).
- Priority reason: **high** — the MVP is defined as one journey; without this
  integration nothing, including H6, can be walked through or tested.
