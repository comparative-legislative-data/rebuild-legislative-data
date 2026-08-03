# Endpoint Inventory Decision Memo Template

**Status:** Planning template — no endpoint is approved by this document

**Version:** 0.1.0
**Last updated:** 31 July 2026

Use this template for DEC-0007. It selects the complete research-relevant
endpoint inventory before any capture, proxy, or DB1 implementation proposal.

| Required field | Record |
| --- | --- |
| Exact endpoint route and permitted parameters | State source route, parameter limits, and explicit exclusions. |
| Family and research purpose | Identify the legislative question or future evidence role. |
| Native-access status | `PROPOSED`, `EXCLUDED`, or `DEFERRED`, with stated query-contract limits. |
| DB1 status | `PROPOSED`, `EXCLUDED`, or `DEFERRED`, with lineage and payload-retention requirements. |
| Variable roadmap | List `TIER_1_2_CANDIDATE`, `DEFERRED_TIER_3_PLUS`, and `UNRESOLVED` uses separately. |
| Source evidence and uncertainty | Link assessment evidence; distinguish observed statements, owner requirements, and unresolved claims. |
| Volume, pagination, licence, privacy, and drift risk | State evidence or `UNRESOLVED`; no estimates by assumption. |
| Exclusions | State endpoint families or fields deliberately outside this inventory. |
| Capture/proxy/DB1 acceptance criteria | Define what a later implementation proposal must prove. |
| Stop conditions | Define authority, schema, access, volume, or semantic conditions that block work. |

The owner decision must state the approved inventory scope, any phased
implementation order, and whether a subsequent capture/proxy/DB1 proposal may
be prepared. It does not itself authorise external requests or implementation.
