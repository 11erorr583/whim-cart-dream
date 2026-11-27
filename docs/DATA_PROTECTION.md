# Data protection design
Proposed retention limits, subject to owner and jurisdiction review before collection.
| Data | Purpose | Proposed retention |
|---|---|---|
| Email, password hash | Account access | Until deletion; revoke sessions immediately |
| Session/reset token hashes | Authentication | Expiry/revocation; purge within 7 days |
| Orders, vault, goals | Simulation and optional insights | Until deletion; remove or irreversibly anonymize within 30 days |
| Verified phone and consent | Optional confirmation | Remove phone within 30 days of withdrawal/deletion; minimal consent evidence only for approved legal need |
| Operational logs | Reliability/security | 30 days; restricted audit events 90 days |
| Encrypted backups | Recovery | Rolling 30 days; restore must reapply deletion tombstones before serving traffic |
No real cards, shipping addresses, precise location, microphone or camera required. No ad tracking, sale or behavioral profiling. Treat wellness history as sensitive. Use TLS, managed encryption keys, field-level phone encryption, restricted decryption by call worker only. Never log tokens, phone, full requests or wellness details. Export and deletion require recent authentication; exports short-lived and owner-only. Revoke sessions, cancel pending calls/jobs, delete processor data, verify completion; pseudonymization alone is not anonymization. Document legal exceptions and notify customer where appropriate. Provider contracts, regions, legal bases, age eligibility and retention approval are launch blockers.
