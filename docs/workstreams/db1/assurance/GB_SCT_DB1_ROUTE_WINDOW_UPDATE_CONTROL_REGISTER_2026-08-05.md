# GB-SCT DB1 Route/Window Update-Control Register — 5 August 2026

**Authority:** DEC-0109. **Evidence date:** DEC-0108 metadata audit.  
**Interpretation:** an `INITIAL` baseline is retained evidence, not evidence
of present-day upstream equality. The following exact route rules cover all
113 current DB1 route/windows; the named year intervals are literal source
windows, not a user-supplied query range.

| Current route/window set | Count | Retention condition | Control class / unit | Permitted statement |
| --- | ---: | --- | --- | --- |
| 25 fixed collection routes named in `D4_REFERENCE_ROUTES`, `D4C_INSTITUTIONAL_ROUTES`, and D5–D16 collection constants in [`foundation.ts`](../../../../apps/api/src/db1/foundation.ts) | 25 | `RETAINED` | `DAILY`; named D4A–D16 unit for its route | “DB1 has a dated retained response and a daily reconciliation control.” |
| `gb-sct.mqa-questions-{2011…2025}.collection` and `gb-sct.votes-on-motions-{2011…2025}.collection` | 30 | `RETAINED` | `WEEKLY`; D18 | “DB1 has a retained historical annual response; weekly control exists, but this audit does not make an as-of-current claim.” |
| `gb-sct.mqa-questions-2026.collection` and `gb-sct.votes-on-motions-2026.collection` | 2 | `RETAINED` | `DAILY`; D17 | “DB1 has a dated retained 2026 response and a daily reconciliation control.” |
| `gb-sct.committee-official-reports-{1999…2024,2026}.collection` | 26 | `RETAINED`, except 2006 | `BASELINE_ONLY`; no general recurrence declared | “DB1 retains this dated annual response; it is not represented as routinely current.” |
| `gb-sct.plenary-official-reports-{1999…2024,2026}.collection` | 27 | `RETAINED` | `BASELINE_ONLY`; no general recurrence declared | “DB1 retains this dated annual response; it is not represented as routinely current.” |
| `gb-sct.committee-official-reports-2006.collection` | 1 | `RETAINED_UPSTREAM_AVAILABILITY_MESSAGE` | `BASELINE_ONLY`; source recheck separately gated | “At capture, the Scottish Parliament source returned an availability message. DB1 does not treat this as an empty dataset.” |
| `gb-sct.committee-official-reports-2025.collection` and `gb-sct.plenary-official-reports-2025.collection` | 2 | `RETAINED` | `WEEKLY`; D19, first post-audit outcome pending | “DB1 has dated 2025 responses and an enabled weekly control; no currentness claim is made until the result is recorded.” |

## Failure and escalation rule

Historical `FAILED` and `BLOCKED_BY_SOURCE_DRIFT` observations remain in DB1
as audit evidence. A later successful observation does not erase them. Any
future new failure, drift or source-availability response must be recorded as
its own condition; it cannot be converted to zero records or omitted from a
future portal.

## Review triggers

Review this register when a new DB1 capture is authorised, a timer is changed,
a scheduled outcome is recorded, a route is added/retired, an availability
message changes, or before any “as-of”, completeness, integrity or parity
claim. Stored-byte integrity and live parity remain separately unverified.
