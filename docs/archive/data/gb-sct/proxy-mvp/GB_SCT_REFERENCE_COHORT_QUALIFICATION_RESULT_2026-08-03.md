# GB-SCT Reference Cohort Qualification Result — 3 August 2026

**Status:** PASS — three private-pass-through candidates; no relay enabled

**Authority:** DEC-0061

## 1. Method and boundary

This assessment reused the existing non-content route observations and update
signal record. It made no API endpoint request and retained no API response,
value, identifier, text, byte, cache entry, fixture, download, log body, or
database row.

The only fresh external inspection was of the Scottish Parliament Open Data
portal root and the published Scottish Parliament copyright licence on 3
August 2026. The portal root identifies the site as Scottish Parliament Open
Data. The single-page application did not expose its route catalogue in the
text-only inspection, so no route listing was re-requested or inferred from
that page; the exact route forms remain those already observed and recorded in
the DEC-0045 matrix.

## 2. Published basis

The Scottish Parliament copyright page states that published information may
be reused under the Scottish Parliament Copyright Licence. It requires source
attribution, prohibits any suggestion of official status or endorsement, and
excludes personal data, third-party rights, corporate identity, and other
specified rights. The same page directs users to Scottish Parliament open data
at `data.parliament.scot` and says machine-readable datasets are provided
there. The licence is provided without a warranty of accuracy, completeness,
or continued supply.

This is a source-published licensing position, not legal advice. The narrow
candidate assessment below infers that the three collections are published
Open Data information from their presence on the named portal and existing
route observations. That inference is limited by the absence of a route-by-
route licence statement.

Sources inspected:

- [Scottish Parliament Open Data](https://data.parliament.scot/#/api-list)
  — accessed 3 August 2026; portal root identifies Scottish Parliament Open
  Data.
- [Scottish Parliament copyright licence](https://www.parliament.scot/about/copyright)
  — accessed 3 August 2026; attribution, non-endorsement, personal-data,
  third-party-rights, and no-warranty conditions.

## 3. Route handling outcomes

| Route | Existing structural evidence used | Outcome | Required disclosure if later relayed |
| --- | --- | --- | --- |
| `/api/billstagetypes` | 34-element JSON collection; fields `BillTypeID`, `ID`, `Name`, and `Sequence`; all prior field-type observations are numeric except `Name`. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source licence attribution; no endorsement; `Sequence` is not interpreted as a validated ordering; no completeness/currentness claim. |
| `/api/billtypes` | 7-element JSON collection; fields `ID` and `Name`; no usable HTTP update validator observed. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source licence attribution; no endorsement; source-defined labels are not independently interpreted or historically complete; no freshness claim. |
| `/api/sessions` | 6-element JSON collection; fields `ID`, `Name`, `ShortName`, `StartDate`, and `EndDate`; no usable HTTP update validator observed. | `QUALIFIED_FOR_PRIVATE_PASSTHROUGH_CANDIDATE` | Source licence attribution; no endorsement; date and null semantics are not interpreted as a session-boundary rule; no completeness or freshness claim. |

The known field profile of each candidate contains no person/contact/identity
field. That is a limited structural handling observation, not a general
personal-data determination. A later relay must remain no-retention and retain
the licence's personal-data exclusion visibly in its route disclosure.

## 4. Consequences

The three collection forms may now be proposed for a private, source-faithful,
no-retention pass-through implementation. Candidate status does not enable any
route, modify the fail-closed catalogue, or permit deployment.

Detail routes remain unavailable. Bills and Formal Stages retain their existing
more restrictive handling positions. No route is made available publicly, and
no DB1, DB2, variable, chart, export, or research release is created.

## 5. What next

The smallest next step is a proposed exact local implementation and private VPS
deployment package for these same three collection forms. It must define the
fixed source mapping, streaming/timeouts, rate/abuse limits, attribution and
limitations interface, no-persistence proof, beta test sequence, and
project-only VPS verification. It requires separate owner approval.
