# Security policy
## Scope
All frontend, FastAPI, database, worker, assets, dependencies, CI and deployment configuration, including historical secrets. The application simulates retail; no real payments or physical fulfillment. Current implementation is a scaffold, not a verified secure service.
## Trust boundaries and invariants
Treat browsers, IDs, request bodies, uploaded assets, provider callbacks and job payloads as untrusted. Deny by default; authenticate and authorize every private operation against the current owner and role. Never trust client balances, prices, roles, clocks or consent. Separate runtime, migration, worker and administrative privileges. No customer data in public repositories.
Mandatory controls and release tests: [security requirements](docs/SECURITY_REQUIREMENTS.md), [threat model](docs/THREAT_MODEL.md), [data protection](docs/DATA_PROTECTION.md), [test plan](docs/SECURITY_TEST_PLAN.md).
## Reportability
Report reachable confidentiality, integrity, availability, privilege, consent and financial simulation violations with evidence and affected revision. Distinguish design gaps from demonstrated exploits. Cross-account disclosure, account takeover, unauthorized calls and production secrets are high-impact candidates; severity depends on actual reachability and impact. No blanket exclusions or accepted risks. Missing implementation is a release blocker, not automatically an exploitable vulnerability.
## Reporting
Use GitHub private vulnerability reporting if enabled. Otherwise obtain a private reporting channel from the maintainer before sending sensitive details. Do not publish customer information or exploit details in public issues. Maintainer must configure a private channel before launch.
## Limitations
No automated deep scan, dependency audit or penetration test has been completed. Policy applies to all future features; no claim of compliance or security certification.
