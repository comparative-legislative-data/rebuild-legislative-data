# Current Database-mirror QA surface

**Status:** Internal/private QA tool — not a researcher-product acceptance.

The current authenticated Database-mirror view exists to inspect the backend's
retained-release catalogue, original JSON access, basic record projections,
source conditions and provenance. It helped expose real backend defects such
as annual-route normalisation and classification drift.

It is not a template for the Research Portal. Its source-year tables, action
density, manifest-oriented all-years index and inline technical details are QA
mechanisms, not settled researcher-facing design.

Changes to this surface must be limited to preserving its usefulness for
Backend Assurance: truthful source conditions, clear retained-versus-live
boundaries, and diagnostics needed to test backend capabilities. New
researcher-facing features belong to the later Research Portal workstream.
