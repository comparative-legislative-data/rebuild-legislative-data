# Database mirror (DB1)

**Status:** PostgreSQL source mirror verified for its approved 117-response
scope; routine reconciliation enabled; research portal not yet designed.

## The plain-English position

DB1 is the project’s retained Scottish Parliament source layer. It stores the
original response bytes and linked unchanged source objects **in PostgreSQL**.
It is neither the live API catalogue nor the later DB2 research dataset.

The backend has passed its initial capture and a complete later recheck. It
contains 117 approved source responses, 4,063,556 linked source objects, and
an explicit treatment for all 64 selected API forms. The daily/weekly
reconciliation schedule is enabled. Three Scottish Parliament source
conditions are visible rather than hidden.

Read the [current backend state](../../data/gb-sct/GB_SCT_DB1_CURRENT_BACKEND_STATE_2026-08-06.md)
for the complete explanation, including a live detail-route result retrieved
again from DB1 PostgreSQL, the exact verification results and the remaining
limits.

## The only active DB1 controls

1. [Current backend state](../../data/gb-sct/GB_SCT_DB1_CURRENT_BACKEND_STATE_2026-08-06.md)
   — human-readable scope, storage, route treatment, assurance and gap record.
2. [Response-unit matrix](../../data/gb-sct/GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md)
   — the exact 117 source URLs/windows and their check cadence; change only by
   a new owner decision.
3. [Backend-assurance result](../../data/gb-sct/GB_SCT_DB1_A6_BACKEND_ASSURANCE_RESULT_2026-08-06.md)
   — detailed direct PostgreSQL and recheck evidence.

## Boundaries and next step

DB1 does not transform source fields into research variables, infer missing
data, or make a currentness claim between scheduled checks. Off-VPS recovery
is deliberately deferred. The temporary ingest/QA presentation is not the
research product.

The next task is an independently designed research portal that makes the
existing mirror useful: clear source descriptions, raw and parent-backed
access, formats, downloads, snippets, field guidance, citations and visible
source limitations. It requires its own proposal and owner approval.

The draft [external research-portal commission](../../planning/GB_SCT_DATABASE_MIRROR_RESEARCH_PORTAL_EXTERNAL_COMMISSION_2026-08-06.md)
sets out the independent design input sought before that proposal is prepared.
It authorises no implementation.
