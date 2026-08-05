# GB-SCT DB1 Reconciliation and Update Controls — 5 August 2026

**Evidence type:** observed timer and database metadata, not a new source
comparison.

## Observed control plane

The audited project has 17 enabled DB1 timer units. At audit time all were
active/waiting. Daily controls D4A–D17 had successful 5 August runs. Weekly
D18 had a recorded successful trigger and is next due on Sunday 9 August;
weekly D19 is enabled and waiting for its first scheduled run on the same day.
The API, web and isolated PostgreSQL services were active.

## Current declared cadence

| Route family / control | Observed cadence | What current evidence supports | Remaining control gap |
| --- | --- | --- | --- |
| D4A–D17 reference, collection and 2026 annual routes | Daily | A new scheduled reconciliation event is expected every day; 26 route latest states are `UNCHANGED` and one is `CHANGED`. | The controlled scope register must link every individual route to its owning timer and failure/retry rule. |
| D18 historical Questions and Votes windows | Weekly | A scheduled historical-window control exists. | The declared comparison/retry position for each 2011–2025 window must be placed in the scope matrix. |
| D19 2025 Official Reports | Weekly | The timer is enabled and waiting. | It had not run at audit time; D19’s first actual reconciliation outcome must be recorded after its scheduled run. |
| Other Official Reports annual windows | No general recurrence demonstrated | Initial source-capture/reconciliation evidence exists. | A wider cadence decision is required before an “as-of current” claim is possible. |

## Reconciliation evidence model

Each observation records a route, capture/manifest reference, state, date and,
where relevant, a failure code. Historical observations retain 19 `FAILED`
and two `BLOCKED_BY_SOURCE_DRIFT` events. Neither is the latest route state at
audit time; they remain important evidence of the control history and must not
be deleted or hidden.

## Required correction design

The next approved Backend Assurance package should define a single
machine-readable schedule row per expected DB1 route/window with:

- expected route/window identifier and source family;
- owner timer or explicit `UNSCHEDULED` status;
- normal cadence and next-due calculation;
- last successful/changed/failed state;
- retry and escalation rule;
- exception treatment; and
- rule for describing an honest “as-of” position.

It must distinguish a retained historical baseline from a route that the
project claims to reconcile routinely. It must not silently treat any failed,
blocked or unavailable response as an empty data set.
