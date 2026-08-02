# GB-SCT Exploratory API Reconnaissance Operating Boundary — DEC-0055

**Status:** Approved operating boundary

**Version:** 1.0.0

**Recorded:** 2 August 2026

**Authority:** Project-owner instruction to treat this phase as exploratory
inspection of the selected public APIs, while preserving academic-grade
transparency for later data handling.

## 1. Purpose

This is a reconnaissance phase, not data ingestion. Its purpose is to inspect
the approved DEC-0007 public Scottish Parliament API inventory so the project
can determine:

1. which endpoint forms and parameters are usable for the intended research;
2. what response structures, identifiers, pagination, coverage, and practical
   limitations are encountered; and
3. what published terms, reuse conditions, or operating restrictions appear to
   govern later use.

It supersedes DEC-0054's overly restrictive per-request execution model for
future exploratory work. DEC-0054's stop record remains historical evidence;
it does not block normal reconnaissance under this boundary.

## 2. Approved scope and working rhythm

The approved scope is every route form in the DEC-0007/DEC-0045 selected
inventory, worked in coherent route-family cohorts: Bills and sessions;
members, parties, government and committees; motions/questions/answers; and
official reports/votes. The matrix remains the source of truth for exact route
forms and intended priority.

Within a cohort, the maintainer may inspect the public API catalogue, directly
request known public unauthenticated route forms, and use ordinary transient
identifiers/parameters needed to understand list/detail relationships. The
maintainer may make normal follow-up requests where a documented route form
requires one, provided the work remains within the selected inventory and is
reasonably bounded for exploratory inspection.

The maintainer will report after each cohort, not after every routine request.
Each report records the endpoints inspected, structural/operating findings,
known restrictions or gaps, and the proposed next cohort. The owner may
redirect priority at any point.

Each route-family report must also record an **updateability profile**: any
published update/change statement; observed HTTP validators/cache/rate signals;
candidate source date/version fields; detectable correction/deletion limits;
and the resulting future mirror-polling uncertainty. This is reconnaissance
metadata, not an authorisation to poll or mirror the source.

## 3. Transparency and data boundary

Exploratory request responses are transient working material, not project data
assets. The durable project record may retain route forms, request method and
parameters, access outcome, transport/shape observations, field names/types,
pagination/volume clues, and concise limitation/restriction findings. It must
not create a raw capture archive, payload dump, fixture, cache, database row,
download, proxy response, or public-facing source-data example.

Seeing an ordinary public identifier or source value transiently while
inspecting a response is not, by itself, capture, retention, publication, or a
data-handling incident. Durable reports should nevertheless minimise values and
avoid reproducing them unless a future explicit data-capture or research record
requires and authorises that level of evidence.

No exploratory finding may be presented as a complete mirror, historical
coverage claim, source definition, licensing conclusion, personal-data
classification, Tier 1/2 variable, or research result.

## 4. Meaningful stop gates

Stop the affected route or cohort and surface the issue promptly if it requires
credentials, authentication, payment, an external contact, a route outside the
approved inventory, a potentially material rate/availability intervention,
bulk or repeated harvesting, local or server-side persistence, data
publication, source-terms/legal interpretation beyond the published material,
or a system/database/frontend change.

Do not stop ordinary reconnaissance merely because a public list/detail
relationship requires a transient identifier, a response has unanticipated
ordinary fields, or a normal safe request produces a non-sensitive value in
the working session. Record the limitation and continue where the route remains
within this boundary.

## 5. Gates that remain strict

Separate explicit owner approval is still required before:

- source capture, downloading for retention, DB1, or any operational mirror;
- DB2 variable extraction, transformation, codebook creation, or research
  calculation;
- proxy/native-access service work, frontend exposure, user access, download,
  chart, beta, or public release;
- VPS/database/credential/deployment work; and
- an external contact, new endpoint family, or scope expansion.

## 6. Immediate next cohort

Resume the Bills-foundation cohort by inspecting the remaining unobserved
families—Stage Types, Bill Types, and Sessions—then provide one consolidated
Bills-foundation reconnaissance report. Formal Stages is already inspected to
the limited extent recorded in DEC-0054's safe stop result and need not be
retried for exploratory purposes.
