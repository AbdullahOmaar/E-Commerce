# Phase 0: stabilize identity, shopping data and Firebase security foundations

The current Angular 10 app can use stale user IDs for cart/wishlist writes, displays
incorrect cart totals, leaks Firestore subscriptions, and has no version-controlled
rules. Its original test suite fails 17 of 19 tests and its hosting workflows do not
build or validate the application before deployment.

This PR stabilizes the existing application before a controlled Angular 22 shell:

- Derive identity from Firebase Auth; switch/cancel per-user reads; guard private and
  admin routes with boolean custom claims.
- Correct cart estimates, persist/clamp quantities, roll back failed edits, and improve
  error feedback. Browser prices remain display estimates, not checkout authority.
- Put legacy DTO mapping inside data services, cancel category listeners, propagate
  upload failures, and preserve forms on save failure.
- Remove 14 unused dependencies and repair offline template/route/regression tests.
- Stage default-deny Firestore/Storage rules with emulator coverage, without deploying.
- Replace automatic deployment behavior with validation-only CI and document the
  migration decision and App Check rollout.

Validation: production build PASS; unchanged TSLint rules PASS; 34 browser tests PASS;
7 Firestore/Storage emulator cases PASS; clean npm ci PASS. The 1.8 MB warning budget
is exceeded, while both initial bundles stay below the enforced 2 MB error budget.
See docs/enterprise/VALIDATION.md and its captured evidence for commands and limits.

Migration notes: use an isolated Angular 22 shell under apps/storefront, feature by
feature. Published AngularFire 20.1.0 does not declare Angular 22 support; use the
modular Firebase SDK behind repository contracts unless compatible peers are released.
Root Angular 10/Node 12 remains a temporary EOL baseline. Signals, standalone bootstrap,
pagination, stock transactions, checkout, orders, full accessibility and native
modernization are not implemented by this PR. Admin access requires a trusted custom
claim. Live data and live rules have not been audited or changed.

Keep this PR **Draft**. No merge, production deployment or live rules rollout is
requested. Require passing exact-commit CI and explicit owner approval before merge.
