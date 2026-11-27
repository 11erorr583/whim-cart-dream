# Mandatory security requirements
Normative supplement to SRS; stricter requirements prevail. All are planned, not verified.
| ID | Required control | Release evidence |
|---|---|---|
| SR01 | Central deny-by-default authentication and owner-scoped queries for every private object, including nested resources, exports and jobs; admin MFA and separate catalog role without customer access | Two-account and role matrix tests |
| SR02 | Argon2id with calibrated cost; verified email; random hashed single-use expiring verification/reset tokens; generic auth responses; rate limits; revoke sessions on reset/deletion; rotate session on login; idle and absolute expiry | Auth abuse and recovery tests |
| SR03 | Host-only Secure HttpOnly SameSite cookies, CSRF token and origin validation on mutations; no tokens in localStorage; exact origin allowlist; no credentialed wildcard CORS | Browser CSRF/session tests |
| SR04 | Parameterized SQL, strict schemas rejecting unexpected privileged fields, bounded bodies/pagination, escaped output, CSP without unsafe-eval, frame-ancestors none, nosniff, HTTPS/HSTS in production, private responses no-store | Injection/header/cache tests |
| SR05 | Composite ownership and currency constraints, restricted ledger writer, sign/kind checks, one opening/debit/refund per event, checked integer arithmetic and bounded quantities; consistent vault-first locking; reconcile and alert | PostgreSQL concurrent and rollback tests |
| SR06 | Server-only accrual cursor, nonoverlapping periods, immutable policy versions, prospective timezone/goal changes, bounded catch-up and balance caps; no rewards for shopping duration | Clock, replay and overflow tests |
| SR07 | Calls disabled by default; verified number, explicit per-call consent, revocation and quiet hours rechecked immediately before dispatch; per-account/number/global quotas and cost circuit breaker; no automatic retry of ambiguous provider outcome | Sandbox abuse, revocation and timeout tests |
| SR08 | Verify provider signature using canonical URL/body and provider SDK; reject unknown call IDs; dedupe callbacks, monotonic status transitions; no sensitive voicemail or recordings | Forgery/replay/out-of-order tests |
| SR09 | Allowlisted asset origins, no arbitrary URL fetching, isolated processing, size/texture/geometry/decompression limits, integrity hashes and licensing; no third-party trackers | Malformed asset and SSRF tests |
| SR10 | Private DB, least-privilege non-superuser roles, separate migration credentials, encrypted transport/storage/backups, secret manager and rotation; fail startup on development credentials in production | Deployment review and restore drill |
| SR11 | Lock dependencies, audit resolved versions and container images, scan secrets including history, pin CI actions to immutable commits; minimal CI permissions; deploy only exact tested main commit | CI evidence and deployment gate |
| SR12 | Data minimization, export/correction/deletion, consent withdrawal, retention and processor deletion; no advertising profiling or sale; redact logs | Privacy lifecycle tests |
| SR13 | Bounded worker retries, leases, dedupe, schema validation, no PII in job payloads; recheck account status and ownership; dead-letter alerts | Crash/replay tests |
| SR14 | Restricted audit logs, incident response, monitoring, tested recovery; no secrets or contact details in telemetry | Incident exercise |
## Release rule
No public customer registration until applicable P0 controls pass. Real calls remain disabled until SR07/SR08 and provider/legal review pass. No unresolved high-impact security findings at launch; any exception requires explicit owner decision and documented expiry. Main-only workflow remains; deployment gates are mandatory, not yet configured.
