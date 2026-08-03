# DB2 canonical variables workstream

**Status:** Not started; no variables, datasets, charts, or research claims exist

## 1. Purpose and user value

DB2 will be the canonical research-data layer. It may later assess declared
DB1 captures/projections as constrained inputs to explicitly defined Tier 1
direct and Tier 2 deterministic variables, with codebooks, validation evidence,
versioned releases, usable downloads, and later reproducible charts.

Its value is not merely convenience. It gives researchers inspectable variable
definitions, source/capture lineage, temporal rules, null semantics, known
limitations, and a route back to the underlying data-management layer.

## 2. Current boundary

DB2 has not begun. There are no canonical tables, released variables, codebooks,
downloads, charts, or research conclusions. The proxy and a future DB1 do not
automatically create a DB2 value. DB2 must adapt to the scope, lineage, and
limitations of any available DB1 record; it does not set DB1’s capture scope,
schema, or implementation priorities.

## 3. Intended first scope

The current roadmap identifies possible Tier 1/2 candidates around bill
identity and formal progression, sessions, and time-varying MSP/party/
government/committee context. Each remains a candidate until a variable-level
specification and validation package establish its source fields, semantics,
temporal rule, transformation, null behaviour, and limitations.

Motions, official reports, votes, document-derived material, and bill-amendment
evidence remain later work. In particular, votes on amendments to motions must
never be represented as votes on amendments to bills.

## 4. Decision and implementation path

DB2 is a separate future mini-project. If it proceeds, its package must state
the research question or user need, unit of analysis, candidate variable set,
provenance tier, exact available input lineage, deterministic rules, validation
tests, codebook/release design, access formats, and chart boundary. It needs
its own owner approval before implementation or release. It cannot make a DB1
change a hidden precondition of an analytical objective.

## 5. Initial gaps and review approach

The gaps are intentionally substantial: source-field semantics; ID and
relationship meaning; temporal interval rules; inclusion/exclusion criteria;
validation data and tests; codebook format; release/versioning contract; and
the distinction between an observed field, a deterministic derivation, and an
unavailable value. Review is mandatory before release and after any input
capture, source-schema, rule, or validation change.

## 6. Detailed records

Read the [approved endpoint and variable roadmap](../../data/gb-sct/ENDPOINT_INVENTORY_AND_VARIABLE_ROADMAP.md)
and [programme design — DEC-0042](../../data/gb-sct/GB_SCT_TRANSPARENT_ACCESS_DB1_DB2_PROGRAMME_PROPOSAL_DEC0042.md)
with the provenance and validation requirements in the
[project design](../../governance/PROJECT_DESIGN.md). The detailed evidence
base remains in the [GB-SCT archive](../../archive/data/gb-sct/).
