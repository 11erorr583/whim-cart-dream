# Software Requirements Specification
Whim Cart Dream | Version 1.0 | Proposed baseline
## 1. Purpose and scope
A realistic animated virtual shopping website with an immersive 3D mall/mart, realistic sound, simulated orders, confirmation calls and a persistent virtual financial vault that grows over elapsed time and wellness streaks. Social motivation: offer shopping without real debt. Not a game, bank, real marketplace or validated treatment. No real payment, physical delivery, card entry, cash withdrawal or real shipping address. All financial and order screens disclose simulation.
## 2. Stakeholders and operating environment
Visitors, registered shoppers, catalog administrators, operators and optional voice provider. Modern desktop/mobile browsers, keyboard/touch, WebGL where supported; accessible 2D fallback. Python FastAPI mandatory; React/TypeScript/Vite selected. PostgreSQL, SQLAlchemy/Alembic, Three.js/R3F, Web Audio proposed. HTTPS and private database in production.
## 3. Functional requirements
| ID | Requirement (shall) | Story | Priority |
|---|---|---|---|
| FR01 | Provide registration, login, logout and secure account ownership | US02 | P0 |
| FR02 | Initialize one persistent virtual vault per account and show ledger | US03 | P0 |
| FR03 | Accrue configured virtual income from elapsed server time including offline days | US04 | P0 |
| FR04 | Evaluate voluntary streak eligibility and credit configured bonuses once; no missed-day forfeiture or login requirement | US05 | P0 |
| FR05 | Provide searchable/filterable catalog and product/variant details | US01,06 | P0 |
| FR06 | Persist cart and wishlist; share cart between 2D and 3D | US07 | P0 |
| FR07 | Generate server-owned quote and atomically place simulated order/debit; reject insufficient funds | US08 | P0 |
| FR08 | Cancel eligible order and post one compensating refund | US09 | P0 |
| FR09 | Show simulated receipt and durable fulfillment timeline | US10 | P0 |
| FR10 | Provide animated realistic retail environment, one walkable aisle at MVP and mall departments later | US11 | P0/P1 |
| FR11 | Provide opt-in spatial real-world sound effects, separate volume and mute | US12 | P1 |
| FR12 | Provide audible in-app confirmation with transcript and accept/decline | US13 | P0 |
| FR13 | Offer real telephone confirmation only after verified opt-in and provider approval | US14 | P1 |
| FR14 | Provide neutral spending insights and optional goals/pause | US15 | P1 |
| FR15 | Provide privacy controls, consent revocation, account deletion and accessible alternatives | US16 | P0 |
| FR16 | Restrict catalog/asset administration to authorized roles | US17 | P1 |
| FR17 | Process durable background jobs with retries and deduplication | US18 | P0 |
| FR18 | Clearly label all balances, purchases, calls and deliveries as simulated; never collect real payment details | All | P0 |
## 4. External interfaces
UI: mall entrance, department directory, search/catalog, product details, cart, checkout, order history, vault, account and settings. Realistic retail architecture and product photography; no game points, avatars, confetti or manipulative scarcity. API: REST JSON /api/v1, OpenAPI, structured errors, cursor pagination, idempotency. Database: PostgreSQL schema in DATABASE_ARCHITECTURE.md. Assets: licensed glTF, compressed textures and audio through CDN. Voice: signed webhook and provider adapter; no recording by default.
## 5. Nonfunctional requirements
| ID | Requirement / verification |
|---|---|
| NFR01 | Security: TLS, secure session cookies, CSRF, Argon2id or managed auth, ownership checks, rate limits, secret management; security tests |
| NFR02 | Integrity: integer minor units, atomic checkout, append-only ledger, unique accrual/refund keys; concurrent Postgres tests |
| NFR03 | Performance: provisional ordinary read p95 <300ms at 100 concurrent pilot users; load test |
| NFR04 | UX: provisional 2D LCP <=2.5s on representative mobile, 3D >=30 FPS on defined mid-tier device; measure before launch |
| NFR05 | Accessibility: WCAG 2.2 AA target for 2D, keyboard, captions, reduced motion, 3D fallback; manual and automated checks |
| NFR06 | Privacy: minimum PII, encrypted verified phone, consent and deletion, redacted logs; privacy review |
| NFR07 | Reliability: durable outbox, idempotent retries, backup/restore drill, alerts; failure injection |
| NFR08 | Maintainability: typed modules, migrations, API contracts, tests, CI, documented setup; code review |
| NFR09 | Compatibility: current supported Chrome/Edge/Firefox/Safari, responsive mobile; browser matrix test |
| NFR10 | Responsible design: no rewards for spend/session length, no punitive streaks or unvalidated health claims; UX review |
## 6. Business rules
BR01 virtual money only, no convertibility. BR02 balance never negative; server validates quote. BR03 opening and each accrual once; refunds compensating entries. BR04 streak uses completed eligible days, not time spent in application. BR05 policy version/timezone boundaries recorded; offline accrual allowed. BR06 cancellation before simulated shipment proposed. BR07 calls optional, verified consent, quiet hours and cost caps; failure independent of order. BR08 no physical fulfillment. Illustrative PKR 50,000 opening, 500/day, 1,000 seven-day bonus, additional 5,000 thirty-day bonus; amounts, caps and recurrence pending owner approval.
## 7. Verification and traceability
FR01–04 -> auth, ledger, accrual and streak integration tests; FR05–09 -> catalog/cart/checkout/refund Playwright and Postgres concurrency tests; FR10–11 -> device, audio and fallback QA; FR12–13 -> call acceptance/decline, consent and signed webhook sandbox tests; FR14–18 -> accessibility, privacy, role, worker and disclosure tests. USER_STORIES.md defines acceptance criteria; USE_CASE_DIAGRAM.md defines flows. Release requires P0 tests passing, measured performance, security review, backup restore and deployment rollback. MVP includes one aisle and in-app voice; full mall and real telephony later.
## 8. Constraints and unresolved decisions
Current implementation is only health API, landing scaffold and local DB container. No claim of completed functionality. Owner must approve currency, budget/streak policy, target devices, asset budget, call provider/region/cost, retention and pilot scope. No real phone calls until consent/legal/provider review. Main-only Git workflow per owner; legacy code replaced. This SRS is a proposed baseline, not a signed acceptance contract.

## 9. Mandatory security and privacy amendment (v1.1)
SR01–SR14 in SECURITY_REQUIREMENTS.md are normative requirements, not optional guidance. Add account recovery, verified email, administrator MFA, data export/correction, deletion and consent revocation as P0 where applicable. Real calls are disabled until verified consent, quota, provider and legal gates pass. No advertising trackers or behavioral sale/profiling. SECURITY_TEST_PLAN.md defines release evidence; DATA_PROTECTION.md defines provisional retention. No public launch until applicable controls pass and privacy notice reflects actual processing.
