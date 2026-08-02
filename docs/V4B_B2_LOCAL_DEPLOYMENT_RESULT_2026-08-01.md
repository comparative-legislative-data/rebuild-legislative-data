# V4B B2 Local Deployment Result

**Status:** BLOCKED — no service, final runtime, or final release deployed

**Date:** 1 August 2026

**Authorising decision:** DEC-0039

## Scope and outcome

DEC-0039 authorised the B2 deployment package for the synthetic B1 shell. The package stopped at its required deterministic-packaging gate. It did not install a final runtime or release, create/enable/start a systemd unit, bind ports 3210 or 3220, alter PostgreSQL/Nginx/DNS/firewall, create a secret or database login, or access legislative source data.

The maintainer Mac retained only the source repository and SSH controller. A temporary runtime download made during an initial local-verifier attempt was removed; no local runtime, dependency tree, or production release was installed or retained. The approved runtime download, signature verification, dependency installation, tests, and package builds subsequently ran only in the VPS project staging directory.

## Preflight results

| Check | Result |
| --- | --- |
| Project account/paths | PASS — cld-gb-sct and its root-owned project boundary were present. |
| Protected PostgreSQL state | PASS — 16-main, 16-bills, and 16-cld_gb_sct were active; the before/after protected database-name-set digests were unchanged. |
| Project cluster listener | PASS — only 127.0.0.1:5434 was observed for the project cluster. |
| B2 units and ports | PASS — both proposed service units were absent and ports 3210/3220 were unused. |
| Host compatibility/capacity | PASS — x86_64, glibc 2.39, systemd 255, approximately 11.8 GiB available memory, 251 GiB free project-filesystem space, and six CPUs. |
| VPS verifier/tooling | PASS — curl, gpgv, sha256sum, and tar were available. |

## Private runtime evidence

The VPS staging step downloaded and verified Node v24.18.1 directly using the official Node release signature/checksum process. gpgv reported a valid signature on SHASUMS256.txt.asc; the selected Linux x64 archive checksum passed. The staged runtime reported Node v24.18.1 and npm 11.16.0.

| Artefact | SHA-256 |
| --- | --- |
| Node archive | d6c664df3f3f61458e8c277585571328522d705166723a7c7823a9253a4d15a0 |
| Signed checksum manifest | b04865cae6bfd78008eea4ef9e715889ae3b81a869fea61fd1790be78b91a743 |
| Verified checksum text | 963b6fefe0c1b0f0d731da926ae12d4c552c3898090e94f3db1549b62e7bbb93 |
| Node release public-key ring | 6030d4e0cd53330acf2ab68acd455b7ca98bb5d5975376f0b7c0892308ba2d57 |

The initially extracted runtime inherited the SSH user ownership. This was corrected immediately within the new project staging directory to root:cld-gb-sct; no final runtime path was created.

## Runtime-aligned B1 checks

The clean source commit was 92d67b663b489c5d663d6421a00eb46160f68dda. Using only the staged private runtime, npm ci --ignore-scripts completed, the five B1 tests passed, and the capability scan passed. The first package build also completed.

The required second package build was not byte-reproducible:

| Artefact | First SHA-256 | Second SHA-256 |
| --- | --- | --- |
| Manifest | 678ce16f04340ecc1814bb88a9b58a6653fcbe2802f53e5778497d47174c8117 | 075ac6fbb09f96520ba3a6395f463219c762b69ce41617852447317ad64fcb4a |
| Archive | 7fa5e31f725162d43be2430505355c41ea337a5494872fcca1e8e67b0369ae4e | 6a9f95f5bcd0d558e236de5830395b6873772abe0337bbc219d34fa822d8a6b7 |

The cause has not been investigated or repaired. DEC-0039 requires this check to pass before a final release or unit installation, so the package stopped without attempting a workaround.

## Containment result

The project staging directory was removed after the failure evidence was captured. The post-removal read-only check found:

- no entries below /srv/cld-gb-sct/runtime or /srv/cld-gb-sct/releases;
- cld-gb-sct-api.service and cld-gb-sct-web.service both not-found and inactive;
- no listener on 3210 or 3220, with only project PostgreSQL on 127.0.0.1:5434; and
- unchanged protected database-name-set digests: 41d1c7ede03e0b68c69611d6c544172635c0c59a3c5ff434ea8b9dd87d02609c (port 5432) and 6775a92704adb6b22a832522ee7c35c13edcc0fe0d2ac7f5f855aff159873438 (port 5433).

## Required next decision

DEC-0039 is not a deployment PASS. A new, narrowly scoped corrective proposal is required before inspecting or changing the package implementation to identify and eliminate the target-host nondeterminism. B3 local acceptance, Nginx cutover, public exposure, database/secret work, and all source-data work remain blocked.
