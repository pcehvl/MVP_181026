# Product Context

> **STATUS: FRAMING ESTABLISHED (2026-10-18) — with explicit caveats.**
> Problem, context, primary segment, value proposition (working hypothesis),
> MVP scope, out-of-scope, constraints and validation plan are Product Owner
> decisions, recorded below. Caveats: user needs are unvalidated hypotheses —
> no primary evidence exists; testing with residents happens after the 4-day
> bootcamp; open questions below remain and may revise the framing. This
> notice is removed if a later decision reopens framing.

## Problem

Low-income residents of the municipality lack accessible, affordable, relevant,
and personalized opportunities to develop the skills required to obtain
employment, perform effectively in the workplace, and maintain long-term
employment. (Source: Product Owner framing.)

Main problem statement (Product Owner's words):

> How might we help low-income residents acquire the knowledge, skills, and
> confidence they need to find employment, successfully perform their work, and
> maintain long-term employment?

Design challenge:

> How might we create an inclusive, accessible, and motivating learning
> experience that enables low-income residents to develop job-relevant skills,
> overcome barriers to employment, and succeed in the workplace?

## Target Users

Residents of the municipality experiencing financial hardship who face barriers
to employment or workplace participation, potentially including:

- unemployed adults
- people with limited formal education
- individuals with language barriers
- people with low digital literacy
- ~~employed individuals who need additional skills or support to succeed in
  their jobs~~ — secondary segment, out of MVP scope by decision

Which of these segments are primary and which are secondary is **decided**:
the MVP serves **unemployed adults seeking work** first (decision,
2026-10-18). Residents already employed who need support to keep or progress
in work are a secondary segment, deferred to a later release — their needs
must not be designed into the MVP except where they naturally overlap.

**Context (decision, 2026-10-18):** the setting is Cape Town, South Africa.
The product language is English. Local context considerations to validate
during discovery (interpretations, not evidence): very high unemployment
especially among youth; mobile-first internet access; data (mobile bandwidth)
affordability as a real constraint; periodic electricity cuts (load shedding);
a mix of formal and informal employment.

## User Needs / Goals

As framed by the Product Owner (to be validated with residents — see Evidence
and Insights):

- identify which skills they need to improve their employment prospects
- find suitable, affordable learning opportunities adapted to their
  circumstances
- learn in a personalized way that accounts for education level, language and
  digital literacy
- practise skills relevant to real workplace situations
- build confidence and motivation to learn
- bridge the gap between acquiring skills, securing employment, and adapting
  to the workplace
- continue developing skills after finding employment

## Evidence and Insights

**No primary research evidence exists yet** (confirmed by the Product Owner,
2026-10-18): no resident interviews, no municipality data, no NGO/employment
service input on hand. Discovery with actual residents must be planned before
needs are treated as validated. The current framing
(`docs/design-thinking/01-problem-description.md`) is a Product Owner-authored
problem description. Within it, empirical claims (e.g. "many residents live in
poverty", "residents struggle to identify which skills they need") are treated
as **interpretations and hypotheses pending validation**, not as evidence.

Evidence labels applied to the framing document:

| Statement | Label |
|---|---|
| The municipality should prioritise validating user needs before defining an MVP | decision (Product Owner) |
| Residents face barriers to workforce entry (poverty, education, language, digital literacy) | interpretation — plausible, unvalidated |
| Residents struggle to identify needed skills and suitable learning opportunities | hypothesis — testable in discovery |
| Traditional training is too expensive / poorly adapted for this group | hypothesis — testable in discovery |
| Confidence and motivation are reduced by prior educational hardship | hypothesis — testable in discovery |
| Digital learning tools / AI assistants / mentorship could help | hypothesis — solution ideas, not decisions |

Absence of evidence is itself recorded: see Open Questions.

## Value Proposition

Adopted by the Product Owner as a **working hypothesis** (2026-10-18) — not yet
validated with residents:

> For unemployed adults in Cape Town who can't find work: get a clear,
> personalised path from where you are to a real job — know exactly which
> skills local employers need, learn them in simple, low-data, mobile-friendly
> English, and get practical help taking the first step into work. Free, and
> built for people that expensive courses and job boards leave behind.

Validation note: each promise carries a hypothesis — "know which skills
employers need" (H1), "low-data/mobile-friendly" (H2/H6), "simple English /
personalised" (H3), "practical help into work" (H5). If discovery or MVP
testing falsifies a promise, the value proposition must be revised with the
Product Owner.

## Assumptions / Hypotheses

Testable beliefs to validate during discovery, each with a way to be wrong:

- **H1 — Skill-gap visibility.** Residents who receive a clear picture of the
  skills required by local employers are more motivated to pursue training.
  Falsified if residents already know what skills they need, or if knowing
  changes nothing about their behaviour.
- **H2 — Affordability/access is a decisive barrier.** Cost, technology access
  or time prevent participation in existing programs. Falsified if existing
  free/available programs are underused for other reasons (awareness, trust,
  relevance, scheduling).
- **H3 — Personalization matters.** Learning adapted to literacy level, language
  and digital literacy is needed for progress. Falsified if one-size-fits-all
  programs perform equally well for this group.
- **H4 — Practical/workplace relevance drives completion.** Practice-oriented,
  job-relevant content sustains motivation better than abstract coursework.
  Falsified if completion rates are driven by other factors (social support,
  incentives, scheduling).
- **H5 — Support beyond training improves employment outcomes.** Help with the
  transition into work (and staying in work) is as important as the training
  itself. Falsified if the main bottleneck is purely skill acquisition.
- **H6 — A digital solution is appropriate at all.** The target group can and
  will use a digital tool for learning. Falsified if digital literacy, device
  access or trust makes digital delivery unworkable without heavy human
  support — or if human-only support (mentorship, community programs) is
  sufficient.

## MVP Scope

Decided by the Product Owner (2026-10-18): the bootcamp MVP is the smallest
slice that tests the riskiest hypotheses (H1, H3, H5, H6) in one journey:

1. a resident answers a few questions about their situation (education,
   area/interests, experience)
2. they see a **personalised skills map** — which skills local employers
   demand for jobs they qualify for, with a plain "why this matters"
3. they can try **a few short sample lessons** per skill — simple English,
   low-data, mobile-first
4. they take **one practical next step** (an action towards work, not a job
   application)

Data reality (interpretation): local employer skill-demand data will not exist
in 4 days — the MVP will use seeded/curated content for a few job families,
which must be labelled honestly and validated with city partners.

**Validation plan (decision, 2026-10-18):** the MVP is built during the
bootcamp and tested with actual unemployed adults **after** the bootcamp.
During the bootcamp, evidence is limited to city-partner/stakeholder review
(and optional proxy walkthroughs). All hypotheses (H1–H6) therefore remain
unvalidated at bootcamp end; the bootcamp proves the slice is buildable and
plausible, not that it works.

**Scope expansion (decision, Product Owner, 2026-10-18):** after the MVP was
deployed, an optional post-journey capability was added — residents may sign
in to keep their map and 3-sentence introduction across phones (US-007).
Signed-out use remains fully functional: sign-in is never required, and the
zero-barrier journey is unchanged (so H6 testing stays clean). This relaxes
the "no real auth" posture below **only** for this optional feature, backed
by Supabase Auth + Postgres + RLS (its first use in this product); no admin
tooling or production hardening beyond it is implied.

## Out of Scope

Consequences of the MVP slice decision (2026-10-18) — excluded from the
bootcamp MVP:

- applying to and tracking real job listings
- mentorship, coaching or AI-assistant conversations
- support for employed residents (secondary segment)
- languages other than English
- native mobile apps, offline mode
- production hardening (real auth, admin tooling, load/size at city scale)

## Constraints

Established or strongly implied by the framing:

- **the setting is Cape Town, South Africa — a real initiative with the City
  of Cape Town** (decision, 2026-10-18); English is the product language
- **the work happens in a 4-day bootcamp** (decision, 2026-10-18) — deep
  resident discovery is impossible in this window; learning must come from fast
  research (secondary sources, city partners, assumption-driven prototyping),
  and the realistic output is a validated prototype/demonstration, not a
  production system
- **the bootcamp deliverable is an MVP with the most important features to
  test** (decision, 2026-10-18) — "most important" means highest learning
  value: the features that test the riskiest hypotheses, not the broadest
  feature set. Bootcamp dates: to be confirmed.
- the solution must be affordable — effectively free at the point of use — for
  residents (financial constraints are the problem being addressed)
- accessibility is a core requirement, not a nice-to-have (varied education
  levels, languages, digital literacy)
- mobile-first and data-light delivery should be assumed necessary in this
  context (interpretation to validate: high smartphone use, data cost
  sensitivity, load shedding)

Further constraints (regulatory, data protection, languages, timeline, budget)
are unknown — see Open Questions.

## Open Product Questions

For the Product Owner / discovery to resolve:

1. ~~Which evidence exists already?~~ **Resolved: none on hand (confirmed
   2026-10-18); discovery with residents must be planned.**
2. ~~Which segment is the primary target for the MVP?~~ **Resolved: unemployed
   adults seeking work (decision, 2026-10-18).**
3. ~~Which municipality / country context is this?~~ **Resolved: Cape Town,
   South Africa; English (decision, 2026-10-18).**
4. Who are the local employers and which skills do they actually demand?
5. What human support infrastructure exists (mentors, employment services,
   community organizations) that a solution could build on?
6. What are the hard constraints: budget, timeline, data protection rules,
   political stakeholders?
7. Who are the competitors/complements — existing training programs, NGOs,
   online platforms — and why are they not reaching this group?

## Design Thinking Sources

- `docs/design-thinking/01-problem-description.md` — Product Owner problem
  description (2026-10-18), first artefact of discovery
