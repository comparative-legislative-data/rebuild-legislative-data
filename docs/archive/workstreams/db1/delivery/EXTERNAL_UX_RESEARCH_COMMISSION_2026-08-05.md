# Commission: making the Scottish Parliament Database mirror a world-class research experience

**Status:** ready to issue for independent implementation-option proposals
**Date:** 5 August 2026
**Commissioner:** Comparative Legislative Data (CLD)
**Evidence supplied in this brief:** product context, current interaction and CSS excerpts, data model, constraints and acceptance questions

## The request

We would value independent, practical implementation proposals for the
research interface of a new legislative-data service. Please treat this brief
as self-contained: you will not have access to the repository, database,
production environment, user accounts or further screenshots.

We are not asking for a generic visual refresh. We want a credible,
accessible, researcher-centred interaction model that makes a database mirror
of official legislative data easier to find, understand, inspect, cite and
reuse than the live source API, without hiding uncertainty or altering the
underlying source material.

Please provide **at least two, ideally three, distinct viable implementation
options**, rather than one assumed solution. For each option, explain its
researcher journey, information architecture, interaction model, accessibility
properties, implementation implications and trade-offs. We will use that
comparison to make the design decision ourselves.

Across those options, please provide:

1. a diagnosis of the current information architecture and interaction
   failures;
2. an end-to-end researcher journey and annotated hierarchy for each option;
3. concrete React/HTML/CSS suggestions or illustrative code for the main
   catalogue and release-access screens;
4. guidance on visual hierarchy, typography, spacing, navigation and
   responsive presentation suitable for an academic research service; and
5. an accessibility review and a pragmatic implementation sequence.

We welcome frank criticism. We especially want proposals that can be
implemented without an unnecessary platform rewrite.

## Required response format

Please structure the response so that a non-specialist project owner can
compare proposals directly:

| Section | What we need |
| --- | --- |
| **Option A / B / C** | A name, a short description, a researcher journey and an annotated hierarchy or rough wireframe. |
| **Strengths and risks** | How each option improves discovery, data access, provenance, high-volume use, accessibility and visual quality; what it sacrifices or complicates. |
| **Recommended components** | Semantic HTML/React state model, key CSS/layout patterns and a small illustrative code sample. |
| **Best fit** | Which option you recommend, why, and what evidence would change that recommendation. |
| **Implementation sequence** | A safe first release, later enhancements and acceptance tests. |

Do not assume that the current nested-card/nested-disclosure implementation
must be preserved. Equally, do not propose a framework migration or a design
system merely because one exists: justify any new dependency or architectural
change.

## The product in one page

Comparative Legislative Data is building transparent, reproducible data
infrastructure for comparative legislative research. Its first jurisdiction is
the Scottish Parliament.

There are three deliberately separate products:

| Product | What it does | What it must not be mistaken for |
| --- | --- | --- |
| **Live API access** | An authenticated, no-retention relay to a selected Scottish Parliament API route. | A CLD dataset or a copy held by CLD. |
| **Database mirror** (the subject of this commission) | A PostgreSQL-backed, dated retention of selected Scottish Parliament API responses, with researcher access tools. | The live API, a claim of complete/current coverage, or an analytical dataset. |
| **DB2, later** | A future canonical variables and analysis layer. | Part of the mirror. It is not in scope here. |

The Database mirror ingests selected live Scottish Parliament API responses at
regular documented intervals. It retains the received source response and a
capture manifest (source URL, retrieval time, content type, byte length,
SHA-256 checksum and reconciliation evidence). It does not change source
values or create analytical variables. A retained response can be viewed or
downloaded as the exact dated JSON held by CLD. Where it can be done without
changing source meaning, it may also be browsed through a structured,
server-side record view and accompanied by a field guide.

The central trust proposition is therefore:

> **The raw source response is always the primary research object.** Browsing,
> downloads in additional formats, schema guides and code examples are useful
> access aids, not a replacement for the source material or a hidden
> transformation.

The service is currently an authenticated private beta, but it should be
designed to scale to a broader research audience. The current stack is a
React + Vite front end, Fastify API and PostgreSQL database, with bespoke CSS.
We are not looking to copy an earlier pilot or introduce a heavy design system
unnecessarily; we are open to a small, robust component and token approach if
it gives us a better outcome.

## The primary researcher jobs

A typical political scientist, historian, journalist, research assistant or
data specialist should be able to:

1. recognise which subject area contains the source they need;
2. understand in plain language what an endpoint contains and its coverage;
3. choose the correct retained response or annual window;
4. quickly tell whether an action opens data held in the Database mirror or
   leaves CLD for the current live Scottish Parliament API;
5. view or download the original dated JSON;
6. browse records where that is safe and useful, especially for large
   responses, without forcing a whole-file download;
7. discover fields, types, dates, limits, source availability problems and
   other caveats when they matter;
8. obtain a citable, reproducible reference and code snippets for access;
   and
9. understand the limits without feeling that the product is a diagnostic
   console for its own engineering process.

The relevant research subjects currently include:

- Bills, formal stages and bill reference data;
- sessions, members, constituencies and regions;
- parties and government roles;
- committees and committee roles;
- motions, questions, related records and votes on motions; and
- official reports, including year-specific high-volume material.

Some endpoints have one retained response; others have an annual set or a
large number of year-specific releases. An all-available-years option is
needed so a researcher does not have to retrieve each year individually. That
combined access must be clearly labelled as a Database-mirror-generated access
format, rather than misrepresented as one Scottish Parliament response.

## Non-negotiable data and trust constraints

Please design within these constraints rather than trying to solve them by
removing disclosure.

- **Source preservation:** raw captured bytes are retained and must remain
  directly viewable/downloadable.
- **No semantic transformation in the mirror:** no inferred fields,
  recoding, historical interpretation, joins or analytical variables. Those
  are a separate future DB2 programme.
- **Transparency without self-absorption:** capture date, source URL,
  integrity/checksum, availability status and citation need to be available,
  but implementation jargon must not dominate the first view.
- **No unsupported freshness claim:** it is reasonable to say a response was
  captured at a stated time. It is not reasonable to imply the mirror is
  always complete or current merely because it has a schedule.
- **Availability is evidence:** for example, a 2006 Committee Official
  Reports request returned the Scottish Parliament message “presently
  unavailable”. The UI must identify this as a dated upstream availability
  notice, not say “there are no records” and not expose an internal projection
  failure as the researcher-facing explanation.
- **High-volume sources matter:** plenary and committee official reports,
  motions and related routes can be very large. The experience must work for
  both a small reference list and a large annual source response.
- **Research access must be inclusive:** keyboard use, visible focus,
  screen-reader semantics, contrast, responsive layouts, reduced motion and
  200–400% zoom are acceptance conditions, not later polish.
- **Private access now, clear wording later:** a user is authenticated now;
  the information architecture should not rely on private-beta-only language
  to explain the data product.

## What has gone wrong so far

The existing data and access boundaries work. The issue is product design and
the way those boundaries have been exposed.

1. **Too many nested reveals.** The earlier journey was effectively research
   subject → endpoint → retained release → actions. This makes a simple task
   feel like drilling through an implementation tree. The latest attempt
   reduces this to subject → endpoint → “Access data”, but it currently
   renders blank when that action is selected.
2. **The delivery process leaked into the product.** Concepts such as
   manifests, projections, profile gaps, source positions and access plans
   appeared before a researcher had found the data. They are legitimate
   provenance, but poor first-level navigation.
3. **The data is visually subordinate to caveats.** Defensive explanatory
   text, cards inside cards, and inconsistent open/closed disclosures make
   the primary data action difficult to scan.
4. **Labels need sharper meaning.** A researcher must immediately understand
   the distinction between “View/download original JSON” (the exact dated JSON
   held in the Database mirror) and “Open live Scottish Parliament source”
   (a new visit to the upstream live API, outside the mirror and potentially
   changed since capture).
5. **Context is inconsistent.** Some endpoints have a structured record view
   and observed field guide; others only have original JSON. The interface
   currently says that a guide/view is unavailable without first explaining
   what it would be or why its absence does not imply absence of data.
6. **The visual system is too generic.** It currently has a dark navy and gold
   academic aesthetic, serif headings, border-heavy one-column cards and a
   number of disclosure panels. It is readable, but it does not yet feel like
   a calm, confident research workspace.

The representative interaction and CSS excerpts below show the relevant
structural problems. They should be treated as evidence of a failed approach,
not as constraints on a replacement.

## Current interaction and code excerpt

This is intentionally a small, representative excerpt, not an instruction to
preserve the present structure. The current implementation uses native
`<details>` elements recursively. The most recent shortcut hides an inner
`<details>` summary and forces its body visible with CSS after an outer
“Access data” disclosure opens. That is fragile and is the likely context for
the reported blank panel. We want advice on a better semantic, maintainable
approach.

### Simplified current React shape

```tsx
// Current hierarchy, simplified. A subject contains endpoints; an endpoint
// has one or more dated retained releases.
<details className="catalogue-section">
  <summary>
    <h3>{subject.subject}</h3>
    <span>{subject.endpoints.length} sources</span>
  </summary>

  {subject.endpoints.map((endpoint) => (
    <article className="endpoint-card" key={endpoint.endpoint}>
      <header>
        <p>Scottish Parliament source</p>
        <h3>{endpoint.endpoint}</h3>
        <InlineHelp label={`About ${endpoint.endpoint}`}>
          {endpointDescription}
        </InlineHelp>
      </header>

      <details className="access-data">
        <summary>Access data</summary>
        {endpoint.releases.map((release) => (
          <Db1ResearchReleaseCard release={release} />
        ))}
      </details>
    </article>
  ))}
</details>
```

The release card currently contains:

```tsx
<details className="research-release">
  <summary>{release.endpoint} · captured {captureDate}</summary>
  <section className="access-explainer">
    <h4>Choose how to inspect this response</h4>
    <p><strong>View or download original JSON</strong><br />
       Exact dated JSON retained by the Database mirror.</p>
    <p><strong>Open Scottish Parliament source</strong><br />
       Live upstream API outside the mirror; it may have changed.</p>
  </section>
  <a>View original JSON</a>
  <a>Download original JSON</a>
  <a>Open live Scottish Parliament source</a>
  {/* where available: Browse records; data guide; citation and code examples */}
</details>
```

### Current CSS workaround to avoid

```css
.access-data > summary {
  padding: .8rem 1rem;
  color: var(--cld-accent-strong);
  cursor: pointer;
  font-weight: 800;
}

/* This forces content of an inner, closed <details> to show. */
.access-data .research-release > summary { display: none; }
.access-data .research-release > .route-details { display: grid; }
.access-data .research-release { border: 0; background: transparent; }
```

We do not expect a reviewer to debug the production defect from this snippet.
Instead, please recommend an interaction pattern that avoids depending on
nested disclosure elements for a task-critical data-access path. Examples to
consider include a controlled expandable panel, a dedicated release workspace,
or a direct action that reveals a single stable access area. Please explain
the trade-offs.

### Data model available to the browser

```ts
type Release = {
  route_id: string;
  subject: string;
  endpoint: string;
  source_year: number | null;
  source_url: string;
  availability:
    | "DATA"
    | "EMPTY_COLLECTION"
    | "UPSTREAM_AVAILABILITY_MESSAGE"
    | "RETRIEVAL_FAILURE";
  capture: {
    retrieved_at: string;
    content_type: string;
    raw_byte_length: number;
    raw_sha256: string;
    manifest_id: string;
  };
  reconciliation: { state: string; observed_at?: string };
  research_access: {
    browse_available: boolean;
    record_count?: number;
    observed_structure: Array<{
      key: string;
      observed_types: string[];
      record_count: number;
    }>;
  };
};
```

Access to a potentially large record set is already paged server-side (20
records at a time). It is not necessary to load an entire response in the
browser to make browsing useful.

## Questions we would like you to answer

### Information architecture and navigation

1. What is the clearest route from a research topic to a named source
   response, while keeping each screen scannable for roughly 30 endpoints and
   many annual releases?
2. Should subjects be a persistent left-hand navigation, a grid of landing
   cards, a compact list with an adjacent results pane, or something else?
   Please recommend a responsive alternative for smaller screens.
3. What is the right number of interactions before a user can see meaningful
   data actions? How should a source with one release differ from a source
   with many annual releases?
4. How should the all-years access/download offer appear so that it is useful
   but never confused with one source response?

### Access, meaning and transparency

5. What labels, iconography and layout make the following distinction obvious
   at first glance?
   - exact dated JSON retained by the Database mirror;
   - a download of that exact retained JSON;
   - live upstream Scottish Parliament API content;
   - a future convenience/bulk download generated by the Database mirror.
6. Where should we place capture date, coverage, availability status, source
   URL, checksum, citation and reproducibility code examples? Which belong in
   the default view and which should be revealed on demand?
7. How can a source availability notice be made clear and useful without
   looking like a product error?
8. How should we present a valid raw response that does not yet have a safe
   record browser or field guide? Please propose plain-language microcopy.

### Visual, interaction and implementation advice

9. Propose a visual direction that feels scholarly, calm and high quality
   without becoming ornate or dashboard-like. The current navy/gold palette
   may be retained or evolved; it is not a constraint.
10. Which CSS layout patterns (grid, split pane, sticky action rail, compact
    data table, metadata drawer, responsive cards, etc.) would best serve this
    task? Please give concrete CSS or React examples where helpful.
11. Which content should use a question-mark/help control, an inline
    expandable section, a popover/tooltip, a side panel, or a separate page?
    We do not want to hide task-critical information in a control that users
    may miss.
12. How should the interface work with keyboard navigation, screen readers,
    high zoom and mobile/touch use? Please identify any hazards in our current
    nested-`<details>` approach.
13. Is it preferable to use a small number of controlled React disclosure
    components (`button`, `aria-expanded`, stable region IDs) rather than
    relying on recursive native `<details>`? If so, please show a robust
    pattern.

### Validation and delivery

14. Suggest a short, staged redesign plan that produces an immediate useful
    improvement before deeper work such as bulk download formats, saved
    queries, charts or the later DB2 data playground.
15. Suggest 5–8 task-based usability tests and accessibility acceptance
    checks. We want evidence that the redesign helps researchers find and use
    real sources rather than merely looking more polished.

## Desired qualities of the proposed result

The best proposal will make a first-time researcher feel that the service is
careful, intelligent and generous with access:

- **Data-first:** the source, coverage and useful action are immediately
  visible.
- **Evidence-first when needed:** provenance is rich, citable and easy to
  find, but not an obstacle to a straightforward task.
- **Plain-spoken:** technical truth without unexplained internal vocabulary.
- **Calm at scale:** ten endpoints and fifty annual releases remain easier to
  use than one giant scrolling page.
- **Honest about boundaries:** no false claim that a dated database mirror is
  live, complete, transformed into a research dataset, or equivalent to a
  future analytical layer.
- **Implementable:** recommendations should work in a modest React/Vite/CSS
  application and should favour durable semantic HTML over visual tricks.

## Scope boundary for this commission

This is advice on the user experience, visual hierarchy, accessibility and
front-end implementation direction. It does **not** authorise a change to the
Scottish Parliament data source, capture schedules, PostgreSQL schema,
retained data, permissions, the proxy data pipe, or the future DB2 data model.
Any later implementation will be separately scoped, reviewed and tested.
