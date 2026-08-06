# GB-SCT final initial DB1 response-unit model

**Status:** proposed complete initial source-form model; owner review required  
**Date:** 6 August 2026  
**Evidence:** DEC-0117 through DEC-0121

## What DB1 will be

DB1 will be a PostgreSQL database holding the raw Scottish Parliament API
responses approved for this project. Each stored response will keep its
original bytes and a queryable JSON copy in the same PostgreSQL row, together
with its source URL, capture time, status and checksum. DB1 will not store raw
payloads as VPS files and will not create DB2 variables.

This model accounts for every approved API form. It does not pretend that the
Scottish Parliament supplies usable data from every detail URL.

## The complete 64-form position

| Treatment | Forms | What users can later receive from DB1 |
| --- | ---: | --- |
| Exact retained whole source response | 33 | The whole stored collection or literal annual source response, with capture provenance. |
| Parent-backed detail/filter access | 25 | The matching raw source object or filter result selected from a named retained parent response, with direct parent-capture lineage. |
| Upstream detail-route limitation | 6 | A clear source-condition explanation and the relevant retained parent response where one contains the data. |

**33 + 25 + 6 = 64. No form is omitted.**

The six source limitations are MQA events detail, MQA questions detail, MQA
supports detail, Committee Official Reports detail, Plenary Official Reports
detail, and Votes on Motions detail. Their limitation is attributed to the
Scottish Parliament source behaviour observed in the resolution record, not to
a local database failure.

## Exact raw capture boundary

DB1 retains **117 literal source response units**:

- 29 fixed collection URLs; and
- 88 named annual URLs.

The complete literal list, annual windows and proposed cadence are retained in
the [response-unit matrix](GB_SCT_DB1_RESPONSE_UNIT_MATRIX_PROPOSAL_2026-08-06.md).
That matrix is the capture control: the worker may request only those URLs.
It never constructs an upstream request from an ID found in a response.

The initial raw capture boundary includes the data-bearing parent responses for
all six source-limited detail forms. If the Scottish Parliament returns an
availability/error response for a named parent unit, DB1 records that source
condition instead of inventing empty data.

## What parent-backed access means

For 25 detail/filter forms, a sampled upstream check found that the detail or
filter result was already present unchanged in the parent response. DB1 may
therefore select that raw object from its retained PostgreSQL JSON response.

This is deliberately narrow:

- it makes no new source request;
- it does not rename, clean, join, derive or interpret fields;
- it shows which parent source response and capture supplied the object; and
- it does not claim that every possible upstream detail input has been
  independently captured.

The user-facing portal will later make the distinction obvious. During backend
work, this is only a database capability and provenance requirement.

## How DB1 handles the six source limitations

DB1 does not solve an upstream API defect by guessing inputs or manufacturing
records. For each limited form it will retain the named response condition and
show:

- the exact upstream form;
- the last checked time;
- the returned HTTP/source condition;
- the companion parent response that contains data, where available; and
- the fact that DB1 has not made a local completeness claim for that detail
  route.

This is a complete, honest mirror treatment of a source route that is not
currently usable as an ordinary detail API.

## What this authorises if approved

Approval should be limited to the source-free A1 PostgreSQL proof:

1. create the isolated schema;
2. insert synthetic response bytes and the same synthetic JSON into one
   PostgreSQL row;
3. prove with SQL that both can be retrieved, with matching size and checksum;
4. prove that no payload file is written outside PostgreSQL; and
5. stop.

It does not authorise live source capture, a schedule, a frontend, a download,
or any DB2 work. Those require the next bounded package after A1 passes.

