# GB-SCT DB1 Coverage and Assurance Matrix — 5 August 2026

**Scope of this matrix:** current operational DB1 registry only. It is not yet
the controlled expected-scope inventory required for a complete mirror claim.
No source payloads are reproduced here.

| Registered DB1 source family | Registered route/windows | Capture/lineage | Current reconciliation state | Scheduled control | Known condition / assurance position |
| --- | ---: | --- | --- | --- | --- |
| Bills and formal-stage reference collections | 4 | All retained with manifest/object lineage | Current daily reconciliation evidence | Daily D4A/D5/D6 controls | Internally coherent; expected-scope mapping still required. |
| Sessions, members, constituencies and regions | 10 | All retained with manifest/object lineage | Current daily reconciliation evidence | Daily D4A/D11 controls | Internally coherent; expected-scope mapping still required. |
| Parties, government roles and committee reference | 9 | All retained with manifest/object lineage | Current daily reconciliation evidence | Daily D7–D12 controls | Internally coherent; expected-scope mapping still required. |
| MQA reference collections | 6 | All retained with manifest/object lineage | Current daily reconciliation evidence | Daily D13–D16 controls | Internally coherent; expected-scope mapping still required. |
| MQA Questions annual windows | 16 (2011–2026) | All retained with manifest/object lineage | Historical windows remain initial; current window has later evidence | Weekly D18 for historical windows; daily D17 for 2026 | Cadence/retry evidence needs a controlled per-window declaration. |
| Votes on Motions annual windows | 16 (2011–2026) | All retained with manifest/object lineage | Historical windows remain initial; current window has later evidence | Weekly D18 for historical windows; daily D17 for 2026 | Cadence/retry evidence needs a controlled per-window declaration. |
| Committee Official Reports annual windows | 28 (1999–2026) | All retained with manifest/object lineage | Initial capture evidence | D19 covers 2025 only; wider cadence not declared | 2006 is a retained upstream-availability message. Other years require a declared recurrence policy. |
| Plenary Official Reports annual windows | 28 (1999–2026) | All retained with manifest/object lineage | Initial capture evidence | D19 covers 2025 only; wider cadence not declared | All-year coverage is retained; wider recurrence policy remains a gap. |

## Cross-cutting lineage matrix

| Evidence element | Count / result | Assurance state |
| --- | --- | --- |
| Registered GB-SCT routes | 113 | `CURRENT_REGISTRY_CONFIRMED` |
| Routes without a successful capture | 0 | `PASS` |
| Successful source-capture manifests | 175 | `PASS` |
| Distinct source-capture raw objects | 114 | `PASS — deduplicated repeated captures` |
| Missing manifest → raw-object reference | 0 | `PASS` |
| Manifest/raw content-type or byte-length mismatch | 0 | `PASS` |
| Unsafe raw relative path | 0 | `PASS` |
| Missing file for an approved raw-object reference | 0 | `PASS` |
| Distinct source objects without a passing projection build/profile | 0 | `PASS` |
| Latest reconciliation states | 86 initial; 26 unchanged; 1 changed | `PARTIAL — currentness not proven for initial-only routes` |
| Known current source exception | 2006 Committee Official Reports | `VISIBLE_AND_RETAINED` |
| Expected-scope inventory independent of operational registry | Not present | `SCOPE_GAP` |

## Interpretation rule

`INITIAL` means DB1 recorded its first retained comparison state. It is not a
claim that the source is still unchanged. `UNCHANGED` and `CHANGED` record only
the latest database reconciliation event, not a live-source claim at the time
this document is read.
