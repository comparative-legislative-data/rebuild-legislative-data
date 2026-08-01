# V4A Native-Cluster Pre-flight Correction Proposal — DEC-0027

**Status:** Proposed — no VPS action is authorised by this document

**Version:** 0.1.0

**Prepared:** 1 August 2026

**Decision requested:** DEC-0027

## Exact correction

Approve one replacement V4A action with the same exclusive targets,
prohibitions, pre-flight checks, operation order, capacity floors, resource
limits, verification, and containment as DEC-0026.

The only change is the storage-capacity command:

```text
Replace: df -PB1 --output=avail <path>
With:    df -B1 --output=avail <path>
```

DEC-0026 failed before target completion or mutation because the host rejected
the previous option combination. The replacement command obtains the same
available-byte value without `-P`. It does not relax the 10 GiB storage floor,
the 2 GiB available-memory floor, any identity/port/path check, or any
non-interference rule.

## Scope and consequence

The replacement action remains limited to the new `16/cld_gb_sct` cluster,
`127.0.0.1:5434`, its fresh project identities/databases/paths, and the
service-specific resource limits named in DEC-0026. It does not touch
`16-main`, `16-bills`, Nginx, firewall, DNS, frontend, backend, source data,
or existing services.

Approval of DEC-0027 authorises this corrected one-shot V4A action and its
restricted non-secret result record only. It does not authorise any V4B/V4C
activity, credential, application code, deployment, source capture, or public
claim.
