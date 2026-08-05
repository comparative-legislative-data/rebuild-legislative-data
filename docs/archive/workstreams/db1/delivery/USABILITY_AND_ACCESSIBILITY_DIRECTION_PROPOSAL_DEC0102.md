# DEC-0102: DB1 usability and accessibility direction

**Status:** `APPROVED — DIRECTION ADOPTED; DEC-0103 IMPLEMENTATION PROPOSAL PREPARED`

**Date:** 5 August 2026
**Workstream:** DB1: Scottish Parliament source-preserving mirror

## Decision sought

Approve this direction as the design contract for a later, bounded DB1 interface
implementation. It is deliberately a proposal, not approval to alter the live
application.

| Item | Position |
| --- | --- |
| Current product state | DEC-0101 Stages A–C are privately deployed; owner acceptance is pending. |
| Prompt for this proposal | Acceptance testing showed that the interface works but reads like an internal delivery monitor rather than a research tool. |
| Scope here | Information architecture, plain-language product copy, visual direction, accessibility requirements, and later acceptance tasks. |
| Explicitly excluded | Application/CSS changes, deployment, source requests, capture, database change, schedule change, DB2, charts, playground, public access, or new data claims. |

## The product problem

DB1 correctly preserves the source response, capture evidence and access
controls. Its present presentation gives those internal mechanics equal or
greater prominence than the research task. Terms such as *projection*,
*manifest*, *source position*, and *not yet assessed* force a researcher to
understand our implementation before they can answer basic questions:

1. What Scottish Parliament material is here?
2. What period does it cover and what is its condition?
3. Can I inspect it, retrieve the exact retained response, download it, or go
   to the source?
4. How do I understand its fields and cite the material responsibly?

The reset must make those questions easy without weakening the source-first,
non-transforming DB1 contract. Transparency is not achieved by showing every
technical detail at once; it is achieved by making the right detail available,
clearly labelled, at the point a researcher needs it.

## Product direction

### 1. Start with the research task

The catalogue should use the same research-subject map as the proxy. A compact
subject list reveals endpoints, rather than rendering every endpoint as a large
diagnostic card. Each endpoint should state, in plain language:

- what the source covers;
- retained period/window and capture condition;
- the primary actions available; and
- any source availability exception.

The primary journey is:

```text
Research subject → endpoint → retained release/year/window
  → view data | download raw JSON | open Scottish Parliament source
  → understand fields | verify provenance | cite and reproduce
```

### 2. Give every release a stable research workspace

An endpoint/release page should open with a concise identity line, for example:

> Bills and formal stages / Bill stage types  
> Retained Scottish Parliament response · captured 5 August 2026

It should then put three clearly differentiated actions first:

1. **View data** — a bounded, accessible record browser where that is safe and
   useful;
2. **Download original JSON** — the exact retained source response; and
3. **Open Scottish Parliament source** — the documented upstream source URL.

The remaining material is progressively disclosed through four clear sections:

| Section | Purpose |
| --- | --- |
| Explore | Filter, browse and inspect retained records when a suitable DB1 access aid exists. |
| Download | Obtain the exact retained JSON first; later convenience packages must be separately named and described. |
| Data guide | Show observed fields, types, nesting, examples and known limits without turning fields into DB2 variables. |
| Provenance and citation | Reveal source URL, capture time, checksum, reconciliation evidence, citation text and request examples. |

These are aids over a retained source response. They are not a claim that DB1
is live, complete, current, semantically coded, or a substitute for the
Scottish Parliament as source publisher.

### 3. Make exceptions intelligible

An upstream availability response should be presented as a source condition,
not an implementation failure. For the known 2006 Committee Official Reports
case, the researcher-facing wording should say:

> **Scottish Parliament availability notice** — when this response was
> captured, the Scottish Parliament said the data were presently unavailable.
> This does not establish that historical records do not exist.

The researcher can then view the retained response, open the source URL, and
see the capture date. Do not expose *rejected projection*, *shape review*, or
*not yet assessed* as the main answer. Where browsing genuinely is unavailable,
say **“Raw JSON is available; a record browser is not yet available for this
response.”**

### 4. Keep evidence deep but reachable

Checksums, manifest identifiers, reconciliation timestamps, request examples,
source-position lineage and technical release names are valuable evidence. They
belong in **Provenance and citation**, with copy controls and unambiguous labels,
not as the catalogue's primary visual content. The interface must never hide
the exact raw response behind a browser, profile or download convenience.

## Visual and CSS direction

The existing dark navy, restrained gold and editorial display typography offer
a useful visual mood: serious, calm and recognisably research-oriented. The
pilot may be used only as visual inspiration. We will not copy its components,
CSS, remote-font import, glass effects, animation or application behaviour.

The later implementation should establish a small shared token system that can
also support DB2, charts and a data playground:

- use a readable system sans-serif for data, controls and long text; reserve a
  restrained serif display face for major headings;
- define semantic colour, type, border, spacing and focus tokens; do not use
  gold merely as decoration or as the sole indicator of a state;
- use one calm surface and one clear bordered action/notice style rather than
  repeated nested cards;
- make the data page denser and quieter than a landing page: small breadcrumb,
  concise title, coverage line, action row, then content;
- use tables only for genuinely comparable rows and use accessible lists or
  disclosure patterns for endpoint catalogues and metadata;
- support a wide research desk layout and a one-column mobile layout without
  turning row labels or action buttons into ambiguous icons; and
- avoid decorative animation; honour reduced-motion preferences.

The visual hierarchy is intentional:

```text
Where am I? → What can I do? → What data is this? → How do I understand it?
             → How do I verify and reproduce it?
```

## Accessibility is a research-quality requirement

The target for a later implementation is WCAG 2.2 AA conformance, verified as
an engineering outcome rather than asserted as a marketing claim. Required
acceptance checks include:

- complete keyboard operation, predictable focus order and a strongly visible
  focus indicator;
- no information conveyed by colour alone; text labels for state, source
  exceptions and actions;
- semantic headings, landmarks, buttons, links, table headers, disclosure
  state and code-block labels;
- readable text at 320 CSS pixels and 400% zoom without losing actions or
  context;
- explicit form, error, loading and success feedback near the action that
  caused it; and
- reduced-motion support and enough contrast in both ordinary and focused
  states.

These requirements are aligned with the [GOV.UK focus-state guidance](https://design-system.service.gov.uk/get-started/focus-states/),
[GOV.UK colour guidance](https://design-system.service.gov.uk/styles/colour/),
and [USWDS table guidance](https://designsystem.digital.gov/components/table/).
The product pattern also follows established research-repository practice of
separating discovery, files/downloads, citation and exploration, as illustrated
by [Dataverse's find-and-use guidance](https://guides.dataverse.org/en/latest/user/find-use-data.html)
and [data discovery guidance](https://dataverse.org/book/data-discovery-and-identification).

## One coherent research environment, separate data products

This direction is deliberately reusable but does not merge programme layers:

```text
Research catalogue
├── Live Scottish Parliament proxy (no retention)
├── DB1 retained source releases
├── DB2 canonical datasets and codebooks (later)
├── charts and analysis (later)
└── data playground (later)
```

Shared navigation, visual tokens, accessibility behaviour and provenance
patterns can make the system coherent. Each product must retain its own data
claims, evidence and access boundary. In particular, DB1's data guide is not a
DB2 codebook and a chart must never make DB1 look like a canonical dataset.

## Later implementation package and acceptance test

Following owner approval, a single bounded implementation proposal should name
the exact components, copy changes, accessibility tests, visual regression
screens and rollback path. It should be accepted only if an owner can quickly:

1. find a known endpoint from the research subject;
2. distinguish a retained DB1 response from the live proxy;
3. view and download original retained JSON;
4. find field/structure information without inferring DB2 semantics;
5. understand the 2006 source notice as an upstream condition; and
6. locate source, capture and citation information without navigating a
   developer-oriented monitor.

If a prototype leaves material accessibility or research-workflow questions
unresolved, commission targeted external UX/accessibility research before
continuing. This is a complex research environment; avoiding a premature visual
solution is preferable to locking in an incoherent one.

## Owner decision

The owner adopted this direction on 5 August 2026 and authorised preparation of
the separate exact [DEC-0103 implementation proposal](DB1_RESEARCH_WORKSPACE_IMPLEMENTATION_PROPOSAL_DEC0103.md).
DEC-0102 itself does not authorise an interface mutation, deployment, source or
database action.
