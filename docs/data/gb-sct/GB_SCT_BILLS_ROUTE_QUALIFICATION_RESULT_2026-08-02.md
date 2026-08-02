# GB-SCT Bills Route Qualification Result — 2 August 2026

**Status:** `PARTIAL_OR_CONDITIONAL` — permits preparation of a later,
limited endpoint-observation proposal only

**Authority:** DEC-0044, approved by the project owner on 2 August 2026

**Inspection time (UTC):** 2026-08-02T10:29:08Z

**Scope performed:** Official documentation and terms only. No Scottish
Parliament API route, including `/api/bills` or `/api/bills/:id`, was requested.
No API response, page body, screenshot, cookie, header, credential, source
record, or personal data was retained.

## 1. Evidence consulted

| Official page | Observation relevant to qualification |
| --- | --- |
| [Scottish Parliament Open Data](https://data.parliament.scot/#/api-list) | The Open Data footer links to the Scottish Parliament site and its accessibility statement. The route forms remain identified from the prior rendered-catalogue record, [`GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md`](GB_SCT_API_CATALOGUE_ROUTE_METADATA_2026-07-31.md); this inspection did not call or otherwise open an API route. |
| [Open Data accessibility statement](https://data.parliament.scot/Accessibility.html) | States that the Open Data website is run by the Scottish Parliament Corporate Body (SPCB). This supports host/operator identification, not a guarantee about a particular route response. |
| [Scottish Parliament copyright licence](https://www.parliament.scot/about/copyright) | Describes published information as reusable under the Scottish Parliament Copyright Licence, with attribution and non-endorsement conditions. It permits copying, publishing, distribution, transmission, and adaptation of covered information, but excludes personal data and other listed material. |
| [Scottish Parliament privacy statement](https://www.parliament.scot/privacy) | Describes the SPCB's general personal-data handling. It does not classify either Bills route or establish that a response lacks personal data. |

## 2. Qualification outcome

| Question | Finding | Status |
| --- | --- | --- |
| Source identity and authority | The Open Data accessibility statement identifies the SPCB as the operator; the Open Data page links to the Scottish Parliament site. | `EVIDENCED` |
| Route documentation | The prior authorised catalogue record identifies `/api/bills` and `/api/bills/:id` as Bills routes. The current terms inspection did not request either route. | `EVIDENCED_AT_CATALOGUE_LEVEL` |
| Licence, attribution, and non-endorsement | The published licence provides an affirmative reuse framework for covered information, requires attribution, and prohibits implying official status/endorsement. | `EVIDENCED_WITH_CONDITIONS` |
| Applicability to an exact route response | The checked terms do not expressly name either Bills route or establish whether every response field is covered material. | `UNKNOWN` |
| Personal-data handling | The licence excludes personal data; the privacy statement is general. With no route response, the presence/absence and classification of personal data are unassessed. | `UNKNOWN — RESTRICTIVE DEFAULT` |
| Technical access/rate/pagination conditions | No route-specific authentication, rate, volume, user-agent, pagination, stability, or deprecation condition was found in the inspected pages. | `UNKNOWN` |
| Retention/capture fit | Not determined. No capture or local persistence was proposed or performed. | `NOT_ASSESSED` |
| Pass-through fit | Reuse may be capable of supporting a carefully attributed future route, but the exact response and operating conditions are unknown. | `PARTIAL_OR_CONDITIONAL` |

## 3. Binding conditions for any later proposal

Any later limited endpoint-observation or pass-through proposal must:

1. preserve the Scottish Parliament attribution statement and link to the
   licence where reuse is offered;
2. avoid any wording, branding, or interface cue that suggests Scottish
   Parliament official status or endorsement;
3. treat all unobserved fields as `UNKNOWN` and apply DEC-0008's
   restrictive-default handling until route-level classification is evidenced;
4. name a hard request cap, exact route/parameter form, rate behaviour,
   request metadata, error handling, and stop conditions; and
5. keep any response observation separate from capture/retention/DB1/DB2 or
   public availability authority.

## 4. Next gate

The appropriate next source package, if the owner wishes to proceed, is a
separate limited endpoint-observation proposal for Bills. It must be small
enough to establish response shape, field-level data classification,
identifier/pagination behaviour, and observable access conditions without
claiming a pass-through service, a capture, a mirror, or a dataset.

This result does not authorise that request, an implementation, a proxy,
storage, database write, or beta/public display.
