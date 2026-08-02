# Access-Control Grant Specification — Not Applied

This is the DEC-0058 local review artefact. It is not a migration instruction
and has not been applied to a database.

The later controlled database package must prove the following with the actual
project database/roles before enabling accounts:

1. `cld_gb_sct_access_migrate` owns or can migrate only `access_control`.
2. `cld_gb_sct_access_runtime` has only the required DML privileges on named
   `access_control` tables/sequences and no schema-change privilege.
3. Neither access role can read/write DB1, raw storage, or any canonical
   research schema/table.
4. `PUBLIC` does not retain unintended access to the schema or its tables.
5. The application runtime connects only as the access runtime role for this
   phase, and the connection is loopback/service-local as separately approved.

Candidate SQL must be generated against the actual database ownership and
schema inventory during that later package. Do not run generic grants from this
file without the required denial/grant proof.
