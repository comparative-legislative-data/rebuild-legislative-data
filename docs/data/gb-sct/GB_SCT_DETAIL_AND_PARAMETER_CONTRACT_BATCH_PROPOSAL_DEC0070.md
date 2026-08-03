# GB-SCT Detail and Parameter Contract-Batch Proposal — DEC-0070

**Status:** PROPOSED — evidence-only contract qualification; no route enabled

## 1. Decision requested

Approve one bounded GB-SCT contract-qualification batch for the 12 selected
detail, parameterised, and formal-stage route forms that DEC-0067 records as
blocked by a contract or meaning gap.

The batch would establish only request-contract evidence: exact route form,
accepted/rejected parameter grammar, response-shape class, transport outcome,
identifier-use boundary, and unresolved semantic limits. It would not classify
content, settle terms or handling, enable a relay, retain a body, create DB1 or
DB2, or make a research claim.

## 2. Pre-flight record

| Item | Record |
| --- | --- |
| Active phase | Proxy-phase route qualification; the handling batch is complete, while contract and operational work remain separate. |
| Authority proposed | DEC-0070 under DEC-0055's approved exploratory-reconnaissance boundary, DEC-0057 proxy contract, DEC-0067 triage, and DEC-0045 inventory. |
| Exact route forms | The 12 forms in section 3 only. No other detail, parameter, or route family is in scope. |
| Known uncertainty | Existing evidence does not establish detail-key semantics, parameter grammar, source-defined relationship direction, procedure meaning, terms, route-level handling, or output fit. |
| Smallest change | Perform a single transient, non-retaining contract audit and publish a value-free contract register. |
| Containment / rollback | No system state or source body is retained. A failed or anomalous form becomes an explicit per-route `UNRESOLVED` result; it is not retried with expanded parameters or replaced by another layer. |
| Verification | Check the result has one record per scoped form, no retained source values/identifiers, no unlisted query form, and no operational capability change. |

## 3. Exact scope

| Group | Route forms | Current gap |
| --- | --- | --- |
| Formal stages | `/api/billstages`; `/api/billstages/:id` | Detail-key, handling, and procedure-meaning boundaries remain unresolved. |
| Detail forms for accepted collection cohorts | `/api/billstagetypes/:id`; `/api/billtypes/:id`; `/api/sessions/:id`; `/api/constituencies/:id`; `/api/regions/:id`; `/api/committeetypes/:id`; `/api/motionsquestionsanswerseventtypes/:id` | The accepted collection contract does not transfer to its detail form. |
| MQA event-link parameter forms | `/api/motionsquestionsanswerseventlinks?childUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?mainUniqueId=:id`; `/api/motionsquestionsanswerseventlinks?parentUniqueId=:id` | Parameter/identifier grammar and source-defined link direction remain unresolved. |

## 4. Permitted evidence method

If approved, the batch would use a single controlled pass through the exact
route forms above. For a form requiring an identifier, a transient ordinary
public identifier may be selected only in working memory from the relevant
already-observed route family; no identifier or source value may appear in the
durable result.

For each form, retain only:

- exact route template and query-name grammar tested;
- method, status class, content type, redirect occurrence, and relevant
  non-secret transport headers;
- response-shape class (`ARRAY`, `OBJECT`, `EMPTY_OBJECT`, `ERROR`,
  `TIMEOUT`, or `OTHER_UNRESOLVED`), response byte size, and pagination signal
  where safely observable;
- whether the expected parameter was accepted, rejected, ignored, or
  indeterminate; and
- the explicit unknowns that prevent route availability.

No raw body, source text, response field values, identifiers, request URLs
with substituted values, cache, fixture, log body, database row, or download
may be retained. Source outcomes must not be repaired, normalised, inferred,
or followed through a different endpoint.

## 5. Required contract questions

| Question | Required boundary |
| --- | --- |
| Detail access | Does the exact detail template respond for one transient ordinary identifier, and what response-shape class results? This does not establish the identifier's identity, stability, or semantic role. |
| Parameter grammar | Is each named parameter form accepted in the observed request shape? No additional parameter names, combined filters, ranges, or arbitrary values may be tested. |
| Source failure behaviour | Are redirects, errors, timeouts, or empty objects visible as such? None may be replaced by an inferred success or a cached result. |
| Response boundary | Does the observed response form expose pagination/volume characteristics relevant to a later request contract? This does not establish coverage, completeness, freshness, or a mirror contract. |
| Meaning boundary | What source-defined procedure, relationship, taxonomy, identifier, or temporal meaning remains unknown after the transport/shape observation? No semantic claim is permitted. |

## 6. Stop conditions

Stop the affected form and record `UNRESOLVED` if any of these occurs:

- a credential, login, payment, external contact, or redirect outside the
  Scottish Parliament public API host is required;
- the form requires a parameter, route variation, request rate, volume, or
  identifier-following approach outside this proposal;
- a response cannot be safely described without retaining source content; or
- the observed outcome exposes a new handling, terms, volume, or operational
  concern.

Stopping one form does not stop the remaining independently scoped forms, but
it never authorises a substitute route or changed method.

## 7. Outcome categories

The result will assign one of these non-operational contract states to each
form:

- `CONTRACT_OBSERVED_PENDING_HANDLING_AND_TERMS`;
- `CONTRACT_PARTIAL_OR_UNRESOLVED`; or
- `STOPPED_BY_BOUNDARY`.

No state enables pass-through, capture, DB1, DB2, public provenance, download,
or a variable. A later handling, terms, operational, and implementation
decision remains necessary for every form.

## 8. What approval would enable next

Approval would enable only the controlled evidence method in section 4 and a
value-free result register. If it passes, the next proposal may select a small
subset for separate combined handling/implementation assessment; it cannot
enable a source relay by implication. The independent high-volume operational
batch remains available for separate planning.
