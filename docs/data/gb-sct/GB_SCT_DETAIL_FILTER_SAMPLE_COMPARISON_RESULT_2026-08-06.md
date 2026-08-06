# GB-SCT detail/filter sample comparison

**Status:** limited no-retention source observation — not a capture decision  
**Date:** 6 August 2026  
**Authority:** owner-approved small sample test, 6 August 2026

## Purpose

This small comparison was run because the proposed DB1 response-unit matrix
could not answer whether parameterised/detail routes contain source content
that is absent from their parent collection or annual routes. It is evidence
for the next scope decision; it does not make a route capture-ready, establish
general endpoint equivalence, or authorise DB1 implementation.

## Boundary

- Eight public source requests were made.
- Response bodies, resolved identifiers, raw objects and downloads were not
  retained.
- The durable record contains only route names, transport/shape observations
  and comparison results.
- No VPS, database, codebase, scheduler, proxy, application or frontend action
  occurred.

## Observations

| Parent route and sampled route | Route-level observation | What this supports | What it does not support |
| --- | --- | --- | --- |
| `/api/billtypes` and `/api/billtypes/:id` | Both returned HTTP 200 JSON. The collection was a seven-object array; the sampled detail route was an object with the same two field names: `ID`, `Name`. | A direct-detail response in this sample has the same observed field structure as a collection object. | That every detail value is identical to its collection counterpart, or that the collection is historically complete. |
| `/api/bills` and `/api/bills/:id` | Both returned HTTP 200 JSON. The collection was a 473-object array; the sampled detail route was an object with the same seven field names: `BillTypeID`, `FullName`, `ID`, `PersonID`, `Reference`, `ShortName`, `ThirdPartyOrganisation`. | The sampled Bills detail route did not reveal an additional observed field in this comparison. | That all Bills detail responses have no additional fields or that raw detail responses need not be retained. |
| `/api/motionsquestionsanswerseventtypes` and `/api/motionsquestionsanswerseventtypes/:id` | Both returned HTTP 200 JSON. The collection was a two-object array; the sampled detail route was an object with the same two field names: `EventType`, `EventTypeID`. | The sampled detail route has the same observed field structure as a collection object. | Any claim about event semantics, all values, or the other MQA detail forms. |
| `/api/motionsquestionsanswerseventlinks` and one `childUniqueId` filter request | Both returned HTTP 200 JSON arrays. The parent collection had 5,721 rows. The filtered response had one row with the same three field names (`ChildUniqueID`, `MainUniqueID`, `ParentUniqueID`), and its serialized object was an exact row-level match in the parent collection held transiently for this comparison. | For this sample, the filter response was a subset of the unfiltered collection; it did not add a different row structure. | That every filter value is a subset, that link direction has a semantic meaning, or that the unfiltered collection is complete/current. |

## Result

The sample rejects the prior assumption that all 31 parameterised/detail forms
should automatically be treated as wholly extra DB1 data. Four route-family
comparisons instead show a plausible **parent-response coverage hypothesis**:
some detail/filter routes may be alternative source presentations of objects
already returned by a retained collection.

This is promising but deliberately limited evidence. It is not enough to call
any form covered, omit it from the mirror, or substitute a database-generated
view for an exact retained upstream detail response.

## Proportionate next audit

Before finalising the DB1 matrix, run a no-retention **stratified endpoint
coverage audit**:

1. compare a small declared sample for every remaining low-volume detail/filter
   family against its parent collection;
2. record field/shape relationship as `SAMPLED_SUBSET`,
   `ADDITIONAL_FIELDS_OBSERVED`, `STRUCTURALLY_DIFFERENT`,
   `NO_RELIABLE_COMPARISON`, or `SOURCE_UNAVAILABLE`;
3. assess high-volume annual/detail families separately, with strict transfer
   limits and no inferred record crawl; and
4. produce a single route-coverage-and-academic-access table before deciding
   whether each form requires direct DB1 retention or can be represented by a
   clearly labelled retained parent response.

That next audit needs its own exact request and source-action approval. It is
not authorised by this result.
