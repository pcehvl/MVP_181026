---
name: Product Management
description: Move from discovery evidence to a refined, testable backlog of User Stories with clear traceability and human-owned decisions
---

# Product Management

Generic method for turning heterogeneous discovery material into a backlog of
refined, ready User Stories. The human is the Product Owner and decides product
vision, scope, priority and acceptance.

## 1. Evidence intake

Accept heterogeneous material: interviews, observations, analytics, support
records, personas, journey maps, story maps, prototype feedback, research notes,
screenshots, documents.

Store source material in a dedicated discovery folder when appropriate. Keep the
original artefacts; do not overwrite them with summaries.

Never invent missing research. If evidence is absent, record that absence as an
open question rather than filling the gap with assumptions.

## 2. Evidence discipline

Label every statement with one of:

| Label | Meaning |
|---|---|
| evidence | Something observed or reported in source material |
| interpretation | What you infer the evidence means |
| assumption | Believed to be true but unverified |
| hypothesis | Testable belief about the world, with a way to be wrong |
| decision | A choice the Product Owner has made |

Never present an interpretation, assumption or hypothesis as evidence.

## 3. Product framing

Establish with the human before creating any backlog:

- problem being solved
- target users and their needs
- value proposition
- assumptions and hypotheses to validate
- MVP scope and explicit out-of-scope
- constraints
- open product questions

Record the outcome as stable product context. Product context changes only by
human decision.

## 4. Backlog and identifiers

The backlog is the set of User Story directories in the product area. It is
independent of any external issue tracker.

Use sequential product-owned identifiers (`US-001`, `US-002`, ...):

- allocated once, never reused
- independent of any external system's numbering
- owned by the Product Assistant role

## 5. User Story specification

One Story per directory, one authoritative `spec.md` per Story. Frontmatter
carries identity and lifecycle state only:

```yaml
---
id: US-001
title: Short action-oriented title
status: backlog
priority: high
---
```

Product lifecycle statuses are exactly: `backlog`, `ready`, `done`. Do not add
development states such as "In Progress" or "Review" to the product lifecycle;
those belong to the implementation process.

Include only the sections relevant to that Story, chosen from:

- User Story (as a persona-scoped statement of intent)
- Product Context (link, do not duplicate)
- User Need
- Evidence and Insights
- Acceptance Criteria
- UX / UI
- Constraints
- Out of Scope
- Open Questions
- Traceability

Keep implementation decisions out of the spec unless they are genuine product
constraints.

## 6. Acceptance Criteria quality

Every Acceptance Criterion must be:

- observable — a reviewer can see whether it holds
- testable — it can be checked by a person, an automated test or an inspection
- scoped — one behaviour each, not a bundle
- free of hidden implementation detail

Bad: "The system uses efficient queries."
Good: "- **AC1 — Empty list explained.** When a list request returns no records, the empty state is shown with an explanation and a next step."

### Numbering contract

Every criterion carries a stable ID from the moment it is written:

- format: `- **ACn — Short Title.** <criterion text>`
- `AC1 … ACn` are sequential in the order written; the Short Title is 3–7
  descriptive words
- all other artefacts (plan, verification evidence, Pull Request) reference
  criteria by `ACn` ID — never by bullet position, and never by restating the
  criterion text
- once a Story's plan is approved, its criteria are never renumbered and no
  criterion is inserted without the human; any such change requires
  re-checking every existing `ACn` reference in the plan and verification

## 7. Prioritisation

Prioritise with the human using whatever lens fits the product stage (impact,
risk reduction, dependency, effort, learning value). Record the reason for the
current priority so it can be revisited when evidence changes.

## 8. Refinement and Ready

A Story becomes `ready` only when all of the following hold:

- value and scope are sufficiently clear
- Acceptance Criteria are observable and testable
- relevant UX expectations are clear
- blocking product questions are resolved with the human
- the human confirms it is ready

Move it to `ready` only after human confirmation.

## 9. Consistency and traceability

Maintain the chain whenever evidence exists:

```text
Evidence → Insight → User Need → Product Decision → User Story → Acceptance Criteria
```

Regularly check the backlog for: duplicated concerns, contradictory criteria,
Stories that changed meaning without a spec update, and orphaned evidence. Fix
inconsistencies with the human, not unilaterally.

## 10. Boundaries

- Do not implement code or write technical implementation plans.
- Do not create hosted-workflow or external-tracker work items as part of backlog management.
- Ask the human at most ONE question per message, and only when the answer
  materially affects the work and cannot be determined from existing context.
