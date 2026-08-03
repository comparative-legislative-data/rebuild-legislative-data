# Endpoint Inventory and Variable Roadmap

**Status:** Approved framework and selected endpoint inventory (DEC-0007); private raw-proxy MVP closed

**Version:** 1.1.0
**Last updated:** 3 August 2026

## 1. Delivery model

The project has approved a complete, research-relevant GB-SCT endpoint
inventory. The private raw-proxy MVP is closed: authenticated users can inspect
fixed Scottish Parliament source-style responses through the no-retention CLD
relay or directly at the source. It is neither DB1 nor a project dataset.

The next data layer is DB1, a source-faithful operational projection governed
by a new, separately approved planning and implementation package. Canonical
variables, charts, and public analytical claims remain subject to separate Tier
1/2 specification and validation.

This separates **what we preserve for future research** from **what we can
currently publish as a validated research variable**.

## 2. Candidate inventory families

| Family | Research purpose | Native access / DB1 | Tier 1/2 status |
| --- | --- | --- | --- |
| Bills, stages, stage types, bill types | Bill identity and formal legislative progression. | Candidate core inventory. | Candidate first-release variables; exact fields remain unassessed. |
| Sessions | Precise session boundaries and temporal context. | Candidate core inventory. | Candidate first-release variables; exact fields remain unassessed. |
| Members; constituency/region status; party and government roles | Time-varying MSP, constituency, party, and ministerial context. | Candidate core supporting inventory. | Candidate variables; temporal semantics require validation. |
| Committees and committee roles | Committee membership and bill–committee context. | Candidate core supporting inventory. | Candidate variables; link semantics require validation. |
| `Motionsquestionsanswers*` | Motions, questions, answers, procedural events, and potential bill-stage/financial-resolution/amendment vote evidence. | Candidate future-scope inventory retained from the outset. | Unresolved; no bill-linkage or field claim is made. |
| `Orscommitteemeeting` | Committee proceedings and potential Stage 1/2 amendment evidence. | Candidate future-scope inventory retained from the outset. | Unresolved; document/contribution linkage is unassessed. |
| `orsplenarymeeting` | Plenary proceedings and potential Stage 1/3 debate and amendment evidence. | Candidate future-scope inventory retained from the outset. | Unresolved; document/contribution linkage is unassessed. |
| `Votesmotion` | Vote-on-motion evidence. | Candidate future-scope inventory retained from the outset. | Unresolved; relationship to bill stages/amendments is unassessed. |
| Petitions | Not part of the intended initial research direction. | Outside proposed initial inventory. | Not assessed. |

The list above is a family-level roadmap, not a substitute for the approved
exact route set and exclusions in the
[`master endpoint delivery matrix`](GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md).
The original endpoint-inventory proposal is retained in the
[`implementation archive`](../../archive/data/gb-sct/endpoint-inventory/GB_SCT_ENDPOINT_INVENTORY_PROPOSAL_2026-07-31.md).
DEC-0007 approved that inventory on 31 July 2026. The proxy MVP did not
authorise DB1 work; DB1 requires a new owner-approved planning and
implementation package.

### 2.1 Deferred document corpus

The API inventory does not include bill documents, accompanying documents,
marshalled lists of bill amendments, minutes of meetings, or other
document-based sources. These are a distinct later programme, to be considered
after the API-based capture, DB1, Tier 1/2, and chart work has been completed
and reviewed.

The owner reports that bill amendments do not have an API endpoint. This is a
scope constraint for the current proposal, not an independently verified source
finding. `Votesmotion` may contain votes on amendments to **motions**; that
must never be represented as evidence of votes on amendments to **bills**.
Any document-based bill-amendment work requires a later source assessment and
an approved Tier 3+ methodology.

## 3. Native access and DB1 rules

The native-access surface is capture-backed and versioned. It must identify the
source route, capture/build identifier, retrieval window, and any supported
query grammar. It is not an unqualified live pass-through or a promise of full
upstream API compatibility.

DB1 is a loss-aware operational projection regenerated from immutable captures.
It retains record-to-capture lineage and unparsed payload where practical. It
is not called a 1:1 mirror unless a separately evidenced claim establishes the
precise scope and parity of that assertion.

## 4. Variable roadmap

Each DB1 field or relationship is classified independently as one of:

- `TIER_1_2_CANDIDATE` — may become a native or deterministic variable only
  after field/temporal semantics and validation are documented;
- `DEFERRED_TIER_3_PLUS` — retained for later extraction, coding, or other
  approved method; or
- `UNRESOLVED` — neither route is yet supported by evidence.

No endpoint family is excluded from capture merely because it has no immediate
Tier 1/2 variable. Conversely, preservation in DB1 does not make a value fit
for a canonical dataset or chart.

## 5. Required next decision

DEC-0007 is complete and the raw-proxy MVP is closed. The required next
decision is whether to approve a new DB1 planning package. It must define the
proposed DB1 operating model, phased capture/copy strategy, provenance and
reconciliation controls, retention/publication boundary, and verification plan
before it authorises any source-data capture, database implementation, or
release.
