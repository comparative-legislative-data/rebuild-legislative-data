# GB-SCT DB1 Official Reports expansion result — DEC-0099

**Status:** `INITIAL CAPTURE COMPLETE — EVIDENCE CLOSURE RECORDED`
**Date:** 4 August 2026

## Result

The fixed D20 registry captured all 54 approved annual source windows:
Committee and Plenary Official Reports for 1999–2024 and 2026. D19's two
2025 releases remain separately retained and scheduled.

| Measure | Result |
| --- | --- |
| D20 fixed source windows captured | 54 / 54 |
| D20 passing releases | 53 |
| Objects in D20 passing releases | 2,110,836 |
| Rejections in D20 passing releases | 0 |
| D20 source failures / drift observations | 0 / 0 |
| D20 unreleased exception | 2006 Committee, `NOT_AN_OBJECT`, one rejection |
| D19 2025 releases | 2 / 113,860 objects |

Every captured D20 window has a raw object, digest, capture run, manifest,
reconciliation observation, and projection/rejection lineage. The 2006
Committee input is retained as evidence but has no release pointer; it must
not be presented as an empty data release or silently repaired.

## Reconciliation position

D19's 2025 timer performs a real weekly comparison. No D20 reconciliation
timer has been enabled. The choice of an actual comparison schedule for the
current 2026 D20 windows, and a justified historic cadence, is deferred to
DEC-0100's approved Stage 1/2 work. D18's separate failure-retry-only timer
also remains an open remediation item.

## Claim boundary

This is observed source-window coverage, not a claim of complete parliamentary
proceedings, complete Official Reports, or any semantic account of speakers,
bills, stages, committees, amendments, dates, contributions, or votes. DB1
has not created DB2 variables, public access, a generic query service, or a
download/research release.

## Next review

Use [DEC-0100](GB_SCT_DB1_COMPLETION_AND_RESEARCHER_ACCESS_PROPOSAL_DEC0100.md)
to close the update model and approve a bounded researcher-access
implementation specification.
