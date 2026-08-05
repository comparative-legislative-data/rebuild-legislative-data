# GB-SCT DB1 Retained-Data Access Direction — DEC-0082

**Status:** Approved — recorded design direction
**Date:** 3 August 2026
**Decision:** DEC-0082

## Decision

DB1 will not use a universal in-browser table as its retained-data access
model. Every named DB1 release must instead provide an honest, volume- and
shape-appropriate **access mode**. A browser table is one option for a small,
bounded collection; it is not the default promise for a firehose source.

## Common release surface

Every future DB1 release should make the following available before any
dataset-specific access control:

1. release/capture overview, scope, coverage statement, reconciliation state,
   limitations, and citation;
2. observed field guide, clearly distinguished from a semantic codebook or
   DB2 variables;
3. record-level provenance, including source position, manifest, digest and
   capture run, available when needed but not presented as a substantive
   ordering; and
4. named-release history and change/failure/drift signals.

## Access modes

| Mode | Appropriate use | User-facing shape | Constraint |
| --- | --- | --- | --- |
| Small collection browser | Bounded reference material where rendering all retained objects remains intelligible. | Compact table or secondary record browser, with record detail. | Source position is provenance only; the browser must not imply semantic ordering. |
| Server-side selection | Medium collections with an approved, documented technical selection contract. | Declared field selection, pagination/cursor and limited source-preserving filters. | No undeclared query grammar, analytical recoding, or mutable unversioned result. |
| Partitioned or packaged access | Large collections with stable, explicit partitions or a prepared named release. | Fixed-version extracts, declared partitions, checksums and reproducible code snippets. | Each extract states its release/build and any coverage gap; it is not a claim of live completeness. |
| Access plan | Firehose, awkward, or otherwise unsuitable collections. | A transparent account of scale, capture/reconciliation constraints, coverage and available retrieval methods. | Do not supply a misleading “browse all” interface merely to achieve visual consistency. |

Downloads, query interfaces, snippets, format choices, partitions, and any
user-specific access control remain future separately approved packages. They
must preserve the DB1 source-preservation boundary and disclose their named
release/provenance.

## Current application

The D4B/D4C reference collections are small enough for a secondary record
browser. The approved D4C presentation therefore leads with provenance and
observed structure, then places preserved records and their source positions
inside a deliberate **Browse retained records** disclosure. This is an
accepted small-collection implementation, not the general DB1 interface
template.

## What this does not authorise

This design direction authorises no source request, capture, timer change,
database mutation, generic query, download, API expansion, DB2 variable,
public access, chart, or research claim. Each later DB1 cohort must state its
proposed access mode in its own owner-approved package.
