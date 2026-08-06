# Application and private-beta boundary

The application is a private access gateway shared by the Live API catalogue
and any future data work. It is not itself a data layer or research release.

The owner has tested the complete private-beta account journey: application,
superuser review, approval email, password setup, password login, magic-link
login, password change, sign-out and superuser separation. Access remains
restricted to approved users and guests; ordinary accounts do not receive
superuser controls.

The currently deployed application exposes only the private Live API catalogue.
The failed Database mirror code and temporary QA interface have been removed.
Any future mirror ingest-test scaffold is not a researcher portal and requires
an independently reviewed, owner-approved PostgreSQL-first design.

Detailed access-control evidence is retained in
[the private-beta archive](../archive/application/private-beta-mvp/). It is
not necessary reading for normal product or data work.
