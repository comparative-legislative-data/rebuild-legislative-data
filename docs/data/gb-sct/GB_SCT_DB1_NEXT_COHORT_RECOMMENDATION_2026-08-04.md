# GB-SCT DB1 next-cohort recommendation — 4 August 2026

## Recommendation

Make **D15** one fixed medium-volume collection:

`/api/MotionsQuestionsAnswersMotionsBusiness?motionfilter=consideration`

This is the right next step because it is the smallest remaining route that
tests the part of DB1 we still need to prove: useful researcher access to a
non-trivial retained collection, without prematurely taking on a whole-history
or annual firehose. Prior observation recorded approximately 1.3 MB and 1,461
objects, so it fits the present 2 MiB transport boundary and the existing
fixed-pagination reader pattern.

It is a fixed source-defined filter, not a CLD search. DB1 should retain its
exact source response as raw bytes and source objects, with the fixed filter
shown prominently in the release provenance. It must not claim that the set is
complete, bill-specific, a stage/vote series, or analytically classified.

## Why not the other immediate candidates

| Candidate | Recommendation | Reason |
| --- | --- | --- |
| Business motions — `consideration` | **D15 now** | Medium, fixed, previously within present transport budget; directly exercises pagination on meaningful volume. |
| Business motions — `programme` | Next after D15 | Previously about 3.6 MB, exceeding the current 2 MiB gate; needs an explicit enlarged-budget decision, not a silent limit change. |
| Questions by year | Later design package | A useful exact source window, but previously about 6.5 MB and requires a window catalogue, transfer budget, and year-by-year release policy. |
| Whole-history MQA motions/events/supports | Defer | Known firehose/latency risk; no current bounded safe contract. |
| Votes on motions | Defer to a dedicated annual-window package | Important future evidence, but must preserve the distinction between motion-amendment votes and bill amendments. |
| Committee/plenary official reports | Defer to a dedicated annual firehose package | High research value but 124–150 MB annual observations require streaming, cancellation, and researcher-access design beyond the current collection pattern. |

## D15 proposed operating shape

- One exact source URL, including the literal `motionfilter=consideration`.
- Initial capture plus immediate same-route comparison; daily reconciliation at
  a non-conflicting time; no retry or parameter variation.
- Retain raw bytes, manifest, digest, source positions, projection/rejection
  counts, and a named fixed release only.
- Private server-side pagination; provenance and observed structure shown in
  the existing MQA group; no generic filter, download, raw-object route, join,
  or DB2 variable.
- Keep the current 2 MiB/30-second/JSON-array gates. A gate failure is a
  recorded D15 stop, not permission to enlarge a limit or try another source.

## What this unlocks

D15 is not an analytical dataset. It establishes whether the DB1 mirror can
present a medium, source-defined response in a researcher-usable way while
preserving enough provenance to distinguish it from both the live proxy and
later DB2 variables. If accepted, its outcome should decide the next design
package: either a second fixed business-motion filter with a deliberate larger
transfer budget, or an annual-window architecture for questions/votes.

## Decision requested

Approve D15 as the one fixed `motionfilter=consideration` collection under the
contract above, or direct a different next step.
