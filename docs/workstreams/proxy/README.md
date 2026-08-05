# Upstream proxy workstream

**Status:** MVP closed and deployed; review required before expansion or public release

## 1. Purpose and user value

The proxy makes Scottish Parliament API material easier to find and inspect
without representing it as Comparative Legislative Data’s own dataset. An
approved private-beta user can choose a subject family, reveal an endpoint,
then open a fixed source-style example or source-year route in one of two ways:

1. through the CLD no-retention relay, which adds request provenance headers;
   or
2. directly at the Scottish Parliament API.

The user can therefore see both the route being requested and the raw source
response. The proxy improves discoverability, explanation, and provenance
without changing the upstream content.

## 2. Scope and hard boundary

The proxy is an authenticated access layer over a fixed set of approved
Scottish Parliament routes. It makes no claim that a response is complete,
current, semantically sufficient, or suitable for analysis. It does not
retain a response body, create a capture, populate DB1, create a DB2 variable,
provide a download from a CLD dataset, or make a research claim.

The approved route inventory is preserved in the
[master endpoint delivery matrix](../../data/gb-sct/GB_SCT_MASTER_ENDPOINT_DELIVERY_MATRIX_DEC0045.md).

## 3. Evidence gathered before delivery

The project inspected the public route catalogue and then undertook bounded,
non-retentive route reconnaissance. The resulting evidence established the
selected inventory’s route forms, visible parameter patterns, response-shape
signals, high-volume/firehose routes, year-window behaviour, and limited
updateability signals. It also recorded unresolved handling, semantic, and
operational limits rather than converting them into data claims.

Key evidence remains available as:

- [endpoint-inventory archive](../../archive/data/gb-sct/endpoint-inventory/);
- [reconnaissance archive](../../archive/data/gb-sct/reconnaissance/);
- current [route-handling register](../../data/gb-sct/GB_SCT_ROUTE_LEVEL_HANDLING_REGISTER_2026-08-03.md),
  [high-volume register](../../data/gb-sct/GB_SCT_HIGH_VOLUME_OPERATIONAL_REGISTER_2026-08-03.md),
  and [update-signal result](../../data/gb-sct/GB_SCT_UPDATE_SIGNAL_RECONNAISSANCE_RESULT_2026-08-02.md).

## 4. Decisions and approach

DEC-0042 established the separate proxy → DB1 → DB2 programme. DEC-0045
retained the inclusion-first inventory, while keeping route scope distinct
from delivery authority. DEC-0072 then authorised the authenticated, private,
no-retention raw-proxy MVP. The owner accepted the completed MVP after
end-to-end testing and closed it as an MVP.

The decisive design choice was to follow the Scottish Parliament catalogue’s
own strategy: concrete source-style routes and year examples, rather than
asking users to guess opaque identifiers or free-form parameters. Routes are
grouped by subject family so that discoverability improves without pretending
that CLD has replaced the source catalogue.

The complete decision and delivery record is
[DEC-0072](../../archive/workstreams/proxy/mvp/GB_SCT_FAST_TRACK_PRIVATE_RAW_PROXY_EXPANSION_DEC0072.md).

## 5. Technical implementation and acceptance

The private-beta application supplies authentication and a catalogue interface.
Each selected route is visibly labelled with its operating class, limitations,
and likely source presentation (raw browser response or source-file download).
The relay uses the fixed Scottish Parliament host and returns the transient
source response without storing or transforming it. The paired direct action
leaves CLD and opens the equivalent source URL.

The MVP was exercised through the private-beta account flow, including account
approval, password and magic-link access, sign-out, and superuser separation.
Representative proxy routes were owner-tested. Detailed implementation and
acceptance records are grouped in the
[proxy-MVP archive](../../archive/workstreams/proxy/mvp) and the
[private-beta archive](../../archive/application/private-beta-mvp/).

## 6. Issues encountered and changes of approach

- The first catalogue interaction model exposed free-form ID/year inputs. That
  did not match the Scottish Parliament catalogue, so it was replaced with
  concrete source-style examples and fixed annual routes.
- Source routes do not all present alike: some responses render as raw JSON in
  a browser while others are delivered by the source as files. The catalogue
  now discloses that distinction instead of promising a uniform viewer.
- Early authentication testing revealed stale browser state after account
  changes and sign-out failures. The application session and feedback handling
  were corrected and owner-tested end to end.
- The detailed, cohort-by-cohort delivery trail became difficult for a human
  reader to reconstruct. This narrative is the corrective overview; the
  detailed records remain available rather than being discarded.

## 7. Gap analysis and legacy considerations

The MVP is deliberately incomplete. It does not establish source completeness,
freshness, licence interpretation beyond the recorded scope, response-schema
stability, IDs beyond the source examples, pagination, retention authority,
or research meaning. High-volume official-report and MQA routes remain a
particular operational issue for later DB1 work. The API’s limited update
signals mean a later mirror cannot rely on an assumed upstream watermark.

The proxy also has no public-release decision, no public user tier, no project
data download, and no commitment that a currently listed upstream route will
remain available. Prior prototype material is not part of this implementation
or evidence base.

## 8. Review approach

Review the proxy before any expansion, public-release change, material source
catalogue/API change, authentication/provenance failure, or by the review date
in the [governance review log](../../governance/GOVERNANCE_REVIEW_LOG.md),
whichever occurs first. The review should check:

1. source-route availability and source-style navigation;
2. relay/direct equivalence and no-retention behaviour;
3. visibility and accuracy of route limitations and presentation labels;
4. private-beta access controls and user feedback; and
5. whether a proposed change belongs in the proxy rather than DB1 or DB2.

Any expansion needs a new decision and a refreshed lifecycle account before
implementation.
