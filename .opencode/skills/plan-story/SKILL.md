---
name: Plan Story
description: Inspect the existing system and return a concise implementation plan (normally ≤200 words) for PLAN-AGENT work; write a plan document only on explicit request
---

# Plan Story

Generic method for planning PLAN-AGENT work. The plan exists to reduce total
implementation time, not to produce documentation. It is written for a
builder who will implement from it without repeating the analysis.

## 1. Inspect the existing system first

Read, before recommending anything:

- the requirement (conversation, or the Story's specification when one exists)
- existing architecture and conventions
- existing code and components the change touches
- existing tests and test conventions
- relevant migrations and configuration

Plan from what exists, not from what you assume exists. If the requirement is
unclear or blocking, stop and raise it instead of planning around it.

## 2. Plan contents

Return the plan in the reply, normally within 200 words, containing exactly:

1. recommended approach
2. existing components/patterns to reuse
3. specific files/modules to modify
4. required frontend/backend/database changes
5. important dependencies and risks
6. essential verification steps

Reference Acceptance Criteria by `ACn` ID; never restate spec text,
criterion wording or evidence. Never restate the shared verification
approach — point to the `implement-story` skill, §3 "Shared verification
approach".

## 3. Smallest complete vertical slice

Prefer the smallest complete vertical slice that satisfies the requirement end
to end (UI, logic, persistence, tests) over a broad partial implementation.
Avoid speculative architecture, unnecessary abstractions, extra layers and
infrastructure that no current requirement justifies.

## 4. Planning documents (only on explicit request)

Do not create planning documents by default. When the human explicitly asks
for one for the full dossier flow:

- write it as the Story's `plan.md`, beside its `spec.md`, equally concise
- record the specification revision or content hash it was planned against
- keep `status: draft` and present a concise summary; wait for explicit human
  approval before implementation begins
- on approval, record approver and date in its frontmatter; the plan is then
  immutable — deviations go in the verification evidence and the review
- only one dossier Story is planned at a time; never overwrite another
  Story's plan, and keep no second copy elsewhere

## 5. Boundaries

- Do not redefine product requirements, weaken Acceptance Criteria or expand
  scope while planning. If the requirement is wrong, route it back to the
  product loop.
- Do not implement production code.
- Do not guess at missing credentials, environment or access: state the gap.
- Ask the human at most ONE question per message, and only when the answer
  materially affects the plan and cannot be determined from existing context.
