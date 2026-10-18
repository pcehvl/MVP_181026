<!--
  Pull Request template for a single User Story.

  One Story, one dedicated branch, one Pull Request. No Issue references,
  Issue-derived branch names or automatic closing keywords.
-->

## User Story

- **Story ID:** US-XXX
- **Spec:** `product/stories/US-XXX-<slug>/spec.md`
- **Approved plan:** `product/stories/US-XXX-<slug>/plan.md` (`status: approved`)
- **Verification evidence:** `product/stories/US-XXX-<slug>/verification.md`
- **Specification revision / hash tested:** <!-- revision or hash -->

## Implementation Summary

<!-- What was implemented, at a technical level. Reference the approved plan. -->

## Acceptance Criteria Verification

<!-- One row per criterion, by its ACn ID from spec.md. Never by position; do not restate the criterion text. -->

| AC | Short Title | Result | Evidence |
|----|-------------|--------|----------|
| AC1 | ... | PASS / FAIL | ... |

## Local Verification

| Check | Command | Result |
|-------|---------|--------|
| Lint | `npm run lint` | PASS / FAIL / NOT RUN |
| Typecheck | `npm run typecheck` | PASS / FAIL / NOT RUN |
| Unit / component tests | `npm run test -- --run` | PASS / FAIL / NOT RUN |
| Production build | `npm run build` | PASS / FAIL / NOT RUN |
| E2E | `npm run test:e2e` | PASS / FAIL / NOT RUN |

- **Source commit tested:**
- **Uncommitted changes at test time:** <!-- none / describe -->
- **Environment:** <!-- OS, Node version, test data source -->

## E2E, Persistence and Security Checks

<!-- Results of the critical journey, migration and access-control checks; state "none required" explicitly if not applicable. -->

## Checks Not Run

<!-- Required checks not run, each with its reason. Missing required checks block acceptance and merge unless the human explicitly changes the requirement. -->

## Plan Deviations and Known Limitations

<!-- Meaningful deviations from the approved plan, and honest known limitations. -->

## Human Acceptance

<!-- The Product Owner explicitly accepts the currently reviewed revision after inspecting evidence. Self-review is not acceptance. -->

- **Accepted by:** &lt;name&gt;
- **Accepted revision (commit):** &lt;commit&gt;
- **Date:** &lt;date&gt;
