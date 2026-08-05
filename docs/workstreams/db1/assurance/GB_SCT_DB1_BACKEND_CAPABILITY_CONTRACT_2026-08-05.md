# GB-SCT DB1 Backend Capability Contract — 5 August 2026

**Status:** audited current backend capability; this is not a portal design.

| Capability | State | What exists now | Boundary for a future portal |
| --- | --- | --- | --- |
| Dated original JSON access | `AVAILABLE` | The reader resolves a retained manifest/raw-object reference and streams the exact retained object after path and byte-length checks. | Label it as the dated response held by the Database mirror, not as a live API response. |
| Exact original JSON download | `AVAILABLE` | Same retained raw object can be downloaded. | Clearly distinguish from any CLD-generated format. |
| Per-release provenance | `AVAILABLE` | Route, source URL/path, capture time, digest, byte length, content type and reconciliation state are available from metadata. | Use progressive disclosure; do not make metadata the primary path to data. |
| Citation inputs | `AVAILABLE` | The metadata needed for a source/capture/manifest citation is available. | A portal may generate a citation template, but must label CLD as retention/provenance layer. |
| Paginated record browsing | `AVAILABLE` | Passing projections can supply source-position records through read-only access. | It is a convenience view; original JSON remains primary. Render only under a volume/shape contract. |
| Observed field profile | `AVAILABLE` | Passing projections have structure profiles. | Present as an observed guide, not a semantic codebook or DB2 variable definition. |
| Availability/error condition | `PARTIAL` | Metadata supports retained availability/error states; the 2006 Committee condition is explicitly handled. | Generalise state handling through the controlled capability/scope contract, not route-specific UI logic. |
| All-years availability manifest | `AVAILABLE` | The backend can return compatible included/excluded release metadata. | This is an index, not a combined download. Use plain language. |
| All-years original-data archive | `ABSENT` | No combined archive/package is generated. | Do not show a bulk-download action. |
| CSV, JSONL or Parquet generated formats | `ABSENT` | No conversion/version/schema contract is implemented. | Do not offer or imply them until separately specified and tested. |
| Generic database/API query | `ABSENT` | No generic SQL, OData or query service is exposed. | Do not claim database-query access. |
| Direct PostgreSQL researcher connection | `ABSENT` | No researcher database connection capability is declared. | Do not offer connection strings or credentials. |
| Live source parity/currentness | `UNVERIFIED` | This audit made no live request. | Never infer freshness from an internal metadata state. |
| Stored-object fresh integrity rehash | `UNVERIFIED` | This audit did not open raw objects. | A separate approved integrity package is required. |

## Portal contract rule

The future Research Portal may only expose a task after it is marked
`AVAILABLE` here or in a later accepted revision. `PARTIAL` must disclose its
limitation in the action itself; `ABSENT` and `UNVERIFIED` must not be rendered
as unavailable-looking product controls.
