# Security test plan
All tests pending. Use synthetic accounts and sandbox providers, never real customer data.
| Test | Expected result |
|---|---|
| ST01 / SR01 | Account A cannot read, mutate, export or call using B's IDs; catalog admin cannot read private history |
| ST02 / SR02-03 | Expired/replayed reset tokens fail; logout/reset revoke sessions; CSRF and foreign origins rejected |
| ST03 / SR04 | Injection, mass assignment, oversized requests rejected; private responses not cached |
| ST04 / SR05-06 | Concurrent checkout cannot overspend; duplicate order/refund/accrual posts once; mismatched ownership/currency rejected; rollback leaves ledger consistent |
| ST05 / SR07-08 | Unverified/revoked consent, quota exhaustion, forged/replayed callbacks and ambiguous timeout cannot trigger extra calls |
| ST06 / SR09 | Untrusted URLs and oversized/malformed assets rejected |
| ST07 / SR10-11 | Production rejects dev secrets; DB inaccessible publicly; dependency/secret scans pass; restore succeeds |
| ST08 / SR12 | Export isolated; deletion cancels jobs and removes processor data; restored backups respect deletion |
| ST09 / SR13-14 | Worker crash/replay safe; alerts and logs redact sensitive data |
Run unit, real PostgreSQL integration, browser E2E, dependency and secret scans, staging configuration checks and authorized penetration testing. Record revision, commands, results and gaps. No passing status without evidence.
