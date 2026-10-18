---
name: Feedback Management
description: Route product feedback through classification, analysis and a human decision into the correct artefact — or into no action
---

# Feedback Management

Generic method for handling all product feedback. Every piece of feedback
returns through the Product Assistant role. Feedback never automatically becomes
functionality.

## 1. Capture

Record feedback with its source and context:

- who or what produced it (user, stakeholder, support channel, observation, analytics)
- when and where
- the raw wording or observation where available
- any linked artefacts (screenshots, recordings, tickets, notes)

Preserve raw material. Do not rewrite a user's words into requirements.

## 2. Classify

Classify when useful. A single item may carry more than one class:

| Class | Typical signal |
|---|---|
| defect | Something intended does not work as specified |
| usability issue | Works, but is hard, confusing or slow to use |
| changed requirement | Previously agreed behaviour must change |
| new user need | A need not represented in the current backlog |
| feature idea | A proposed solution, often without a stated need |
| invalidated assumption | Evidence contradicts a recorded assumption or hypothesis |
| non-actionable feedback | Opinion, praise, spam or out-of-scope commentary |

A feature idea is not a requirement. Trace it back to the need it claims to
serve before considering it.

## 3. Analyse

For each item establish:

- Evidence / observation: what was actually seen or reported
- Interpretation: what it appears to mean (labelled as interpretation)
- Impact: who is affected, how often, how severely
- Assumptions or hypotheses involved, if any
- Relationship to existing Stories, product context or evidence

Do not invent missing research to strengthen an analysis. Record gaps as open
questions.

## 4. Human decision

Present the analysis and one clear recommendation. The human Product Owner
decides. Valid outcomes:

```text
Feedback → Evidence/Observation → Interpretation → Human Product Decision
  → update an existing Story
  → create a new Story
  → update product context (problem, scope, assumptions, constraints)
  → take no action
```

Never implement directly from feedback without a human decision recorded
against a Story or product context.

## 5. Apply the decision

- **Update an existing Story**: revise its `spec.md`, including Acceptance
  Criteria where needed. Record the feedback source in Traceability.
- **Create a new Story**: allocate the next unused sequential identifier and
  write a fresh spec. Do not reuse identifiers.
- **Update product context**: change the stable product document, and note what
  evidence or decision caused the change.
- **No action**: record the decision and the reason so the same feedback does
  not re-enter analysis unchanged.

## 6. Maintain traceability

Keep the link from feedback source to the artefact it influenced:

```text
Feedback source → Observation → Interpretation → Decision → Story / Context / No action
```

## 7. Boundaries

- Do not auto-promote feedback into the backlog or into code.
- Do not weaken or delete Acceptance Criteria to accommodate feedback without a
  human decision.
- Ask the human at most ONE question per message, and only when the answer
  materially affects the decision and cannot be determined from existing context.
