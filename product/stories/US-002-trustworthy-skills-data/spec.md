---
id: US-002
title: Trust the skills data I am shown
status: ready
priority: high
---

# US-002 — Trust the skills data I am shown

## User Story

As an unemployed adult seeking work, I want the skills content behind my map to
be honest about where it comes from and clearly marked as sample content, so
that I am not misled about what local employers demand and City of Cape Town
partners can vouch for it.

## User Need

- `product/product.md` data reality (interpretation + decision): real local
  employer skill-demand data will not exist within the bootcamp; the MVP uses
  seeded/curated content "for a few job families, which must be labelled
  honestly and validated with city partners".
- Problem description, Key Challenge 2 (Relevance): residents struggle to
  identify which skills local employers actually require — the map answers
  this, so the data behind it must be trustworthy.
- The initiative is a real City of Cape Town effort (`product/product.md`
  Constraints): showing curated data as if it were employer data would
  undermine credibility with residents and partners.

## Acceptance Criteria

- **AC1 — Sample status recorded.** The skills content package states, for
  every job family it covers, that the content is curated sample data and not
  live or official employer demand data.
- **AC2 — Provenance stated per job family.** For every job family, the
  content records where its skills came from — a source, reference, or
  curator rationale — so city partners can validate it.
- **AC3 — Small named set of job families.** The package covers exactly the
  nine named job families in `src/lib/job-families.ts` (Retail and shops;
  Cleaning; Building and manual work; Office and admin work; Driving and
  delivery; Cooking and food work; Hair and beauty; Working with computers;
  Caregiving) and does not imply coverage beyond them. (Decision, Product
  Owner, 2026-10-18 — these were the US-001 provisional families, adopted
  as official; US-001 AC8 depends on this list staying in sync.)
- **AC4 — Reason for each skill included.** For each skill in a job family,
  the content includes a short plain-English reason why the skill matters for
  those jobs (the "why this matters" text shown later in US-003).

- **AC5 — Honest label shown to residents.** The skills content surfaces the
  agreed resident-facing label: "Sample content. These skills were chosen by
  our team to show how the map works. They are not live data from employers
  yet. City of Cape Town will check them with local employers." — shown as a
  note on the skills map (placement specified in US-003).
- **AC6 — Per-family provenance visible.** Each job family's details include a
  short "Where this came from" line stating its provenance, reachable from the
  map. (Decision, Product Owner, 2026-10-18.)

## UX / UI

- The honest label and provenance are product-level content requirements; how
  they are surfaced in the skills map (banner, per-entry note, wording) is
  specified in US-003 and refined with the Product Owner.

### Curation process (decision, Product Owner, 2026-10-18)

1. The project team drafts the skills content for each of the nine job
   families from general public knowledge of the work (curated, not
   employer-sourced).
2. The Product Owner reviews and corrects the drafted content during the
   bootcamp.
3. City of Cape Town partners validate it after the bootcamp.

Provenance wording must state this process honestly — content is
project-team-curated sample data, reviewed by the Product Owner, pending
partner validation; it is not live or official employer demand data.

## Out of Scope

- Live, scraped or real-time employer skill-demand data.
- A complete labour-market dataset or coverage of all job families.
- Admin tooling for editing content (production hardening, out of MVP scope).

## Open Questions

- Which job families are seeded? **Resolved: the nine families in
  `src/lib/job-families.ts` (decision, Product Owner, 2026-10-18).** The
  deferred question "who are the local employers and which skills do they
  actually demand?" stays open — it concerns real employer data (out of MVP
  scope) and partner validation of the seeded content.
- Who curates the content and from which sources? **Resolved: team drafts →
  PO reviews → partners validate after the bootcamp (decision,
  2026-10-18); see UX / UI → Curation process.**
- What exactly must the honest label say, and where do partners see the
  provenance? **Resolved: label wording adopted and provenance visibility
  decided as AC5/AC6 (decision, 2026-10-18); in-map placement stays with
  US-003.**
- How is the "why this matters" wording reviewed before residents see it?
  **Resolved: Product Owner approval is the gate — no skills text or "why
  this matters" wording appears in the app until reviewed and approved by the
  Product Owner; partner validation happens after the bootcamp (decisions,
  2026-10-18).**

## Traceability

- Evidence: none yet (no primary research — `product/product.md` Evidence and
  Insights). Content rests on interpretations pending partner validation.
- Decisions: seeded/curated content labelled honestly and validated with city
  partners (`product/product.md`, MVP Scope, 2026-10-18); real City of Cape
  Town initiative (Constraints).
- Hypotheses: protects the validity of H1 testing — a skills-gap picture built
  on dishonestly presented data cannot falsify or confirm H1.
- Consumed by: US-003 (personalised skills map — the nine families, their
  skills with per-skill "why this matters" reasons, the AC5 label and AC6
  provenance; per-family minimum qualification levels are drafted and
  approved under the same content gate described in UX / UI → Curation
  process) and US-001 (Q3 job-family options must match the AC3 list
  exactly). This story does not depend on either.
- Priority reason: **high** — small content-side scope, but the honest-labelling
  decision makes it non-optional, and US-003 cannot be reviewed by partners
  without it.
