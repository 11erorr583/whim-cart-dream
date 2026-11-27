# User stories and acceptance criteria
Version 1.0 | Priorities P0 essential, P1 full experience, P2 later. IDs trace to SRS and use cases.
| ID | As a... I want... so that... | Priority | Acceptance criteria |
|---|---|---|---|
| US01 | Visitor, browse the mall/catalog so I can understand the service | P0 | Simulation disclosure visible; no login needed for browsing; no real purchase claims |
| US02 | Shopper, register and sign in so my data persists | P0 | Valid account creates one vault; invalid credentials rejected; logout revokes session |
| US03 | Shopper, see my virtual balance and history so I understand spending | P0 | Balance equals ledger; refresh and second device agree; transactions labeled virtual |
| US04 | Shopper, receive time-based income so my budget grows realistically | P0 | Offline catch-up; one credit per period; no duplicate on retry |
| US05 | Shopper, set voluntary wellness goals and earn streak benefits so I can practice budgeting | P0 | No login/time-in-app requirement; missed day does not remove funds; opt-out available |
| US06 | Shopper, search/filter products and inspect variants so I can choose items | P0 | Correct results, prices, availability and empty state; keyboard accessible |
| US07 | Shopper, save items and manage a cart so I can reconsider | P0 | Quantity validated; wishlist persists; 2D and 3D cart synchronized |
| US08 | Shopper, review a quote and place a virtual order so I experience checkout | P0 | No card/address fields; clear total; insufficient funds rejected; duplicate submit creates one order/debit |
| US09 | Shopper, cancel eligible orders so I can recover virtual funds | P0 | One refund only; ledger and order state consistent |
| US10 | Shopper, track simulated delivery and receipts so the order feels authentic | P0 | Durable timeline; no real courier claims; receipts labeled simulated |
| US11 | Shopper, walk through a realistic store and inspect shelf products so I feel present | P0 one aisle / P1 full mall | Guided and keyboard/touch navigation; product selection; shared cart; accessible 2D fallback |
| US12 | Shopper, hear realistic environmental sounds so the store feels natural | P1 | Explicit audio opt-in; spatial attenuation; mute/volume controls; pause hidden tab |
| US13 | Shopper, receive an in-app spoken confirmation so checkout feels realistic | P0 | Accept/decline, audible speech and transcript; failure never blocks order |
| US14 | Shopper, opt into a real phone confirmation so I receive a call | P1 conditional | Verified number, explicit consent, quiet hours, opt-out, simulated introduction; no unsolicited retries |
| US15 | Shopper, review spending insights and pause shopping so I retain control | P1 | Neutral summaries; voluntary limits; no shame, urgency or spend rewards |
| US16 | Shopper, control motion/audio and delete account so I protect accessibility/privacy | P0 | Reduced motion, 2D alternative, session revocation, deletion workflow |
| US17 | Catalog admin, manage licensed products/assets so the store stays accurate | P1 | Role checks; asset license required; deactivate referenced items rather than delete |
| US18 | Operator, monitor and recover jobs so orders and balances remain reliable | P0 | Retry/deduplication, alert on failures, restore test; no sensitive logs |
## Definition of done
Acceptance criteria pass, unit/integration tests and relevant Playwright journeys pass, accessibility reviewed, API/schema docs updated, no secrets, no real-payment paths, build succeeds. 3D/audio changes require device and licensing QA. Stories are planned, not completed.

## Security acceptance amendment
US02: verified email, safe recovery and session revocation. US03–10: cross-account access denied and ledger invariants tested. US11–12: trusted bounded assets, no tracking. US14: per-call consent, revocation, quotas and safe timeout handling. US16: authenticated export, correction, deletion and backup/processor lifecycle. US17: admin MFA and no private customer history access. US18: restricted worker, redacted audit and incident exercise. All stories require applicable SR01–SR14 tests before completion.
