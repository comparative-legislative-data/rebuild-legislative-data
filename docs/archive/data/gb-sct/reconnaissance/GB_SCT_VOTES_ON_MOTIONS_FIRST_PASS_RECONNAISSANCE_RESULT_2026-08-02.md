# GB-SCT Votes-on-Motions First-Pass Reconnaissance Result — 2 August 2026

**Status:** PARTIAL PASS — public route profiling only; no capture, mirror,
proxy, canonical-variable, or release authority

**Authority:** DEC-0055

**Cohort:** Documented annual `votesmotion` route form

## 1. Method and boundary

Five public, unauthenticated requests used the documented
`/api/votesmotion?year=:year` form for 2010, 2011, 2012, 2025, and 2026. Each
had a 30-second cap and a 2 MiB body ceiling. No raw payload, identifier,
source-text example, cache, download, database row, or proxy output was
created.

## 2. Observed availability boundary

| Year tested | Result | What it does and does not establish |
| --- | --- | --- |
| 2010 | HTTP 500; a 36-byte JSON error object with only a `Message` field. | This is not a definitive proof that no 2010 source data exists. It is, however, an observed failure of the documented annual form for that year. |
| 2011 | HTTP 200 JSON; response exceeded 2 MiB and was cancelled. | Confirms route availability at transport level, not record count, schema, completeness, or vote semantics. |
| 2012 | HTTP 200 JSON; response exceeded 2 MiB and was cancelled. | Same limitation. |
| 2025 | HTTP 200 JSON; response exceeded 2 MiB and was cancelled. | Same limitation. |
| 2026 | HTTP 200 JSON; response exceeded 2 MiB and was cancelled. | Confirms that the live route currently accepts 2026, even though the prior rendered catalogue listed year options only through 2025. It does not establish coverage through the whole year. |

No `ETag` or `Last-Modified` header was observed on these responses.

## 3. Research implication

The owner's recollection of an apparent 2011 boundary is consistent with this
limited test: 2010 failed while every tested year from 2011 through 2026
returned HTTP 200. It remains an **observed route-availability pattern**, not a
claim that the underlying vote series begins in 2011 or is complete thereafter.

Votes on motions may include votes on amendments to motions. They must not be
represented as votes on amendments to bills. No link to a bill, bill stage,
financial resolution, or bill amendment was assessed or created here.

## 4. Next work

Identify a source-supported bounded way to inspect annual response structure
and counts without relying on whole-response polling. The detail route remains
unassessed. Any operational retrieval design needs its own DB1/capture approval
and reconciliation strategy.
