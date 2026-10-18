---
name: Implement Story
description: Implement PLAN-AGENT / PR-tracked work as the smallest complete vertical slice, verify it by risk (and against every Acceptance Criterion when they exist), and prepare it for integration
---

# Implement Story

Generic method for building PLAN-AGENT and PR-tracked work. FAST and
PLAN-LITE work need only §2 (vertical slice), §3 (risk-based verification,
tiers in `AGENTS.md`) and §6 (self-review), and report per §7.
Generated code alone is never "done".

## 1. Preconditions

For PR-tracked (dossier) Stories, confirm before writing code:

- exactly one Story is being implemented
- the plan for that Story has explicit human approval
- the specification revision matches the one the plan was approved against
- work happens on a dedicated branch for that Story, never on the integration branch

For PLAN-AGENT work that is not PR-tracked, confirm the Planner's plan is in
hand and implement from it without repeating its analysis.

If any precondition fails, stop and raise it. Do not start another Story
automatically.

## 2. Smallest complete vertical slice

Implement the smallest slice that satisfies the requirement end to end across
UI, logic, persistence and tests. Follow the plan when there is one.

Do not: expand scope silently, weaken criteria, implement unrelated work, add
speculative abstractions, or change the specification to make implementation
easier. Route requirement problems back to the product loop.

## 3. Automated verification

Run the checks required for the mode (`AGENTS.md`, "Risk-based
verification"); auth, RLS, data-access and schema changes always get the full
pipeline plus an explicit security review. Verify from the cheapest useful
level upward:

```text
logic → unit tests
important isolated UI behaviour → component tests
critical user journeys → end-to-end tests
```

Add tests at the level that would actually catch the regression this Story
prevents. Prefer accessible selectors in end-to-end tests. Do not depend on
production data or committed credentials.

### Shared verification approach (no configured backend)

Applies to every Story while no backend project is configured. It is the
single source for this boilerplate:

- automated tests use mocked data; anything that needs a real backend is
  covered by documented manual steps (numbered, with expected result)
- never invent credentials, project URLs or keys; never commit any
- do not start local backend containers
- if the E2E runner is pinned to a mock data mode, that pin is dev-only and
  must never reach a production build
- migrations and access policies that cannot be applied are recorded as
  `NOT RUN — no backend project configured`, never as passed
- the full local verify (`npm run verify`) green is the gate for opening a
  Pull Request
- security checks are run, never assumed; a check that could not run is
  recorded as `NOT RUN — reason`

Plans and verification evidence **reference this section** instead of
restating it. They carry only what is story-specific.

## 4. End-to-end verification

For a Story with a critical user journey, run a meaningful happy-path
end-to-end journey against the real running application, not just mocked units.
Include persistence and access-control checks where the Story touches them.
While no backend project is configured, the journey runs against the real
application with mocked data, and persistence and access-control checks
follow the shared verification approach above.

## 5. Acceptance Criterion verification

When Acceptance Criteria exist (in a spec or in the conversation), explicitly
verify every one and record, per criterion:

- the check that was run
- the result (pass / fail)
- the evidence (test name, command output, screenshot or observation)

A failed or missing required check blocks acceptance and merge unless the human
explicitly changes the requirement. Never reclassify a required check as
optional because it could not run; record it as not run with the reason.

## 6. Technical self-review

Review the change as a reviewer would:

- correctness against the plan and the specification
- security: input handling, authorisation, secrets, data exposure
- data: schema changes, migrations, rollback path
- accessibility and required UI states
- tests covering the changed behaviour
- naming, structure and consistency with existing code
- unintended changes outside the Story's scope

Self-review supplies technical evidence. It is not human acceptance.

## 7. Ready for integration

For PR-tracked work, before requesting review:

- record verification evidence in the Story's `verification.md`, including
  the tested source commit, environment, timestamp and per-check results
- note plan deviations and known limitations honestly
- confirm which required checks were not run and why
- prepare the review request referencing the specification, the approved plan
  and the local evidence

For FAST and PLAN-LITE work (and PLAN-AGENT work that is not PR-tracked),
report the same information concisely in the conversation instead: what
changed, per-check results, checks not run and why, and known limitations.

If code or the specification changes after verification, rerun the affected
checks and obtain renewed acceptance before merge.

## 8. Boundaries

- Do not merge without explicit human acceptance of the currently reviewed
  revision.
- Do not claim a review request exists when it was not actually created; if
  access is missing, prepare the content locally and report the exact remaining
  human action.
- Ask the human at most ONE question per message, and only when the answer
  materially affects the implementation and cannot be determined from existing
  context.
