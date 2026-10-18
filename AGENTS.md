# AGENTS.md

Development harness for AI-assisted MVP work. This file binds the generic
methods in `.opencode/skills/` to this repository. Detailed procedure lives in
the skills; do not duplicate it here.

## Roles

The human is the **Product Owner**. The human owns product vision, scope,
priority, important product decisions and final acceptance.

The **Coder** is the default agent (`.opencode/opencode.json`) and the single
entry point for development requests. It classifies each request into a
development mode and orchestrates directly, delegating to the other project
agents as subagents only when the mode calls for it. There is no separate
routing agent.

| Agent | Involvement | Owns | Must not |
|---|---|---|---|
| Coder | Main development agent; orchestrates every request | BUILD / VERIFY: mode selection, implementation, risk-based verification, report; for PR-tracked work also branch, `verification.md`, Pull Request, deployment when authorised | redefine requirements, expand scope silently, merge without explicit acceptance |
| Planner | On demand (PLAN-AGENT only) | HOW: a concise implementation plan returned in its reply; a Story's `plan.md` only on explicit request | redefine requirements, implement production code |
| Product Assistant | Conditional (see Development modes) | WHY / WHAT: framing, `product/product.md`, backlog, Story IDs, `spec.md`, priority, Acceptance Criteria, refinement, feedback, traceability | implement code, write technical plans |

## Development modes

The Coder selects one mode per request:

| Mode | Use for | Workflow |
|---|---|---|
| FAST | Styling/UI adjustments, small bug fixes, localized component changes, other low-risk changes | Inspect → implement → run relevant checks → fix failures → report |
| PLAN-LITE | Standard user stories, small fullstack features, frontend/backend integration, a few coordinated steps | Inspect → concise internal plan (≤5 steps) → implement the smallest complete vertical slice → run relevant checks and tests → fix failures → report |
| PLAN-AGENT | Architectural changes, DB schema migrations, auth/authorization changes, multi-module features, complex integration risk | Delegate to the Planner → concise plan (≤200 words) → implement, reusing its findings → run checks and tests → fix failures → report |

Rules:

- Choose the least expensive safe mode. When uncertain between FAST and
  PLAN-LITE, choose PLAN-LITE.
- Auth, RLS and data-access changes are never FAST. Schema migrations and
  auth changes are PLAN-AGENT.
- Re-classify mid-task if risk is revealed; escalate rather than cut corners.
- FAST and PLAN-LITE never invoke the Planner and never create planning
  documents. The PLAN-LITE plan stays in the conversation.
- PLAN-AGENT delegates to the Planner and reuses its findings without
  repeating the analysis.
- The Product Assistant is engaged only when a request is too broad to
  implement, needs MVP scope/priority refinement, or needs Story/Acceptance
  Criteria clarification. Once the request is clear enough, proceed in the
  chosen mode.

## Loops

```text
PRODUCT LOOP (only when needed)
Design Thinking → Product Framing → Product Backlog → User Story → Refinement → Ready
```

```text
BUILDING LOOP (every request)
Request → mode selection → implement → verify (risk-based) → report
→ human feedback → refine
```

```text
FULL DOSSIER FLOW (PLAN-AGENT Stories the human tracks this way)
Plan approval → Feature Branch → Implement → Verify → Pull Request
→ Human Acceptance → Merge → Deploy → External Test → Feedback → Product Loop
```

Product management is independent of GitHub. GitHub is used only for source
code, branches and Pull Requests.

## Sources of truth

| Artefact | Location |
|---|---|
| Product context | `product/product.md` |
| Product Backlog | `product/stories/` |
| Story requirements | `product/stories/<US-XXX-slug>/spec.md` |
| Implementation plan | `product/stories/<US-XXX-slug>/plan.md` (`status: draft` → `approved`) |
| Verification evidence | `product/stories/<US-XXX-slug>/verification.md` |
| Implementation | Git (feature branch for PR-tracked work) |
| Database evolution | `supabase/migrations/` |
| Integration / review | GitHub Pull Request (`.github/pull_request_template.md`) |

`spec.md`, `plan.md` and `verification.md` exist only for Stories in the full
dossier flow. For all other work, requirements and results live in the
conversation. Existing Story dossiers are kept.

Do not create competing sources of truth. Do not create a `backlog.md`. Do not
use GitHub Issues, Projects, milestones or GitHub Actions as part of this
harness.

**Story artefacts.** Each dossier Story directory is a complete dossier with
single ownership per artefact, enforced by agent permissions on the artefact
filename: `spec.md` (Product Assistant), `plan.md` (Planner),
`verification.md` (Coder). The plan carries `status: draft` until the human
approves it; approval is recorded in its frontmatter (approver, date) and the
Pull Request pins the reviewed revision by commit SHA — there is no separate
plan archive. Never write another Story's artefacts.

## Documentation for normal MVP development

- User stories and Acceptance Criteria may be given directly in conversation.
- Do not require spec, plan or tasks documents for normal work.
- Document consequential decisions briefly (for example in `docs/` or a code
  comment) when they will matter later.

## Rules that apply to every agent

- **One question at a time.** Ask the human at most ONE question per message,
  and only when the answer materially affects the task and cannot be determined
  from existing context. Never send questionnaires.
- **One Story at a time.** Only one dossier Story is planned or in flight at once.
- **Smallest complete vertical slice.** Prefer a thin end-to-end implementation
  over broad partial work. Architecture emerges from real requirements.
- **No invention.** Never invent users, research, requirements, schema or
  product functionality. Route gaps to the Product Owner.
- **Explicit acceptance.** A PR-tracked Story is accepted only when the human
  explicitly accepts the current reviewed Pull Request revision after
  inspecting evidence. Self-review is not acceptance.

## Technology

| Layer | Choice |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide |
| Backend / data | Supabase (PostgreSQL, Auth, RLS, Storage, Edge Functions when justified) |
| Testing | Vitest, React Testing Library, Playwright |
| Hosting | Vercel (frontend), Supabase (backend/data) |

Prefer existing and shadcn components before creating custom equivalents.
Maintain `docs/ui-guidelines.md`. Derive data requirements from the current
Story and keep the schema smallest that fits. Use versioned migrations under
`supabase/migrations/`. Do not create a separate backend merely to wrap
Supabase, and do not require local Supabase containers.

## Security

- Never expose secrets or privileged credentials. Browser code and `VITE_`
  variables may contain only public client-side values, protected by data-layer
  access policies.
- Use RLS for protected or user-owned data.
- Keep actual configuration in ignored local environment files and provider
  settings. Commit placeholders only (`.env.example`).
- Never commit credentials, and never claim a security check passed without
  running it.

## Testing and E2E

Use the cheapest useful level:

```text
Logic → Vitest
Important isolated UI behaviour → React Testing Library
Critical user journeys → Playwright (tests in e2e/)
```

Critical Stories should normally have a meaningful happy-path E2E journey.
Prefer accessible selectors. Do not depend on production data or committed
credentials. When Acceptance Criteria exist, the Coder must explicitly verify
every one.

### Risk-based verification

| Mode | Required checks |
|---|---|
| FAST | `npm run lint` + `npm run typecheck` + tests already covering the touched code |
| PLAN-LITE | FAST checks + affected unit/component tests + `npm run build` (+ `npm run test:e2e` if a critical journey is touched) |
| PLAN-AGENT / PR-tracked | Full `npm run verify` |

Any change touching authentication, authorization, RLS, data access or schema
always gets the full `npm run verify` plus an explicit security review,
regardless of mode.

## Story → branch → PR

Applies to PR-tracked work: PLAN-AGENT dossier Stories, or anything the human
asks to land via a Pull Request. FAST and PLAN-LITE work may be done directly
in the working tree.

```text
Story ID → branch feature/<story-id>-<slug> or fix/<story-id>-<slug>
→ one Pull Request titled "<Story ID>: <Title>"
→ PR links spec, approved plan and verification evidence
→ human acceptance → merge
```

- Branch from `main` (the integration branch). Never implement PR-tracked
  work directly on `main`.
- Check for an existing branch and PR for the Story before creating them;
  resume rather than duplicate. A merged Story stays done; a later change needs
  a new Story ID.
- PRs reference the Story's `spec.md`, its `plan.md` with `status: approved`, and its `verification.md`. No Issue references, Issue-derived branch names or automatic closing keywords.

## Local verification

For PR-tracked work, run before presenting a PR for acceptance and again
before merge:

```bash
npm run verify   # lint → typecheck → unit/component tests → build → E2E
```

Record evidence in the Story's `verification.md`: story ID and spec
revision, tested source commit, environment, per-check PASS/FAIL/NOT RUN,
Acceptance Criterion-to-evidence mapping, limitations and reasons for anything
not run. Failed or missing required checks block acceptance and merge unless the
human explicitly changes the requirement. If code or the approved spec changes
after verification, rerun affected checks and obtain renewed acceptance.

For FAST and PLAN-LITE work, run the checks for the mode (see Risk-based
verification) and report results in the conversation.

## Iteration loop

```text
Describe → Build → Verify → Preview → Refine
```

- Keep `npm run dev` running and rely on HMR; small changes do not need a
  restart. Playwright reuses the running dev server.
- Correct failures automatically when feasible before reporting.
- Natural-language iterative requests are normal; re-classify each one.

## Deployment

Deployment targets: frontend to Vercel, backend/data to Supabase. Deploy via
documented CLI or manual flow from the verified revision; keep it independent
of hosted workflows. See `docs/deployment.md`. Never deploy without explicit
human authorisation, and verify the live URL and critical journey afterwards.

## Definition of Done

**FAST / PLAN-LITE:** the change is implemented, the risk-based checks for its
mode pass, and the human has previewed it.

**PR-tracked Story** — Done only when:

- the current `spec.md` is satisfied and every Acceptance Criterion passes
- the implementation follows the plan, or meaningful deviations are documented
- required UI, data and security functionality exists; required migrations are correct
- appropriate automated tests and the critical E2E journey pass
- the production build succeeds and no critical technical defect remains
- work happened on the dedicated Story branch
- the PR references its spec, approved plan and verification evidence
- the human explicitly accepted the current reviewed PR revision after inspecting evidence
- changes are merged and relevant checks on the integrated result pass

Generated code alone is never Done.

## Commands

```bash
npm run dev            # start the dev server
npm run lint           # lint
npm run typecheck      # type checking
npm run test -- --run  # unit/component tests (non-watch)
npm run test:e2e       # Playwright E2E
npm run test:e2e:ui    # Playwright UI mode
npm run build          # production build
npm run verify         # all of the above checks in sequence
```
