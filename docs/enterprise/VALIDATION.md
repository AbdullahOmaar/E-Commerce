# Phase 0 validation and handoff

Date: 2026-09-22. Base: `d0a34afed4e2c071cfa91cbb94c154c42aafda72`.
Branch: `enterprise-upgrade/phase-0`. Application code checkpoint: `3020cfe`
(the following documentation/asset-marker commit does not change application logic).
All commands below were executed locally. Remote GitHub Actions has **not** run.

| Gate | Baseline | Phase 0 |
| --- | --- | --- |
| Production Angular build | PASS, existing budgets | PASS, hard initial budget reduced from 6 MB to 2 MB |
| TSLint | FAIL, 533 errors | PASS, existing rule configuration unchanged |
| Browser unit/template/route tests | 17 failed / 2 passed | 34 passed / 0 failed |
| Auth regression before/after | New tests: 2 failed before fix | Same tests: 2 passed after fix |
| Firestore + Storage emulator tests | None | 7 passed / 0 failed, many positive/negative assertions |
| Clean dependency installation | 3,004 packages, npm 11 ignoring scripts | 1,754 packages, npm 6 ignoring scripts |
| Git whitespace check | Not a baseline gate | PASS |
| Remote branch / Draft PR | Not applicable | BLOCKED by write access, no PR created |

## Commands and environments

Legacy checks: Node 12.22.12 and npm 6.14.18; Chromium 133 headless. The host Node
24.19.0 is not used to compile Angular 10. No browser test contacts live Firebase;
component and route fixtures use mock service boundaries with real Angular templates
and the real router outlet. Unexpected Angular errors are rethrown in the fixtures.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm run test:ci
npm run build:production
```

Local production build output was redirected outside `www/` to retain the tracked
baseline artifacts. Production build hash: `9d8d023927bf25681161`.
Warnings remain for legacy Firebase CommonJS modules and the 1.8 MB warning budget:
initial bundles are approximately 1.80 MB (ES2015) and 1.99 MB (ES5), below the 2 MB
hard error limit. Treat that limited headroom as migration work, not a waived gate.

The browser binary initially could not be downloaded through the supplied Playwright
runtime. A Chromium package was installed in an external verification directory and
used for Karma. Local root-container execution used `--no-sandbox`; the workflow uses
standard ChromeHeadless on GitHub's non-root hosted runner. Browser binaries are not
application dependencies or committed artifacts.

Security tests: Node 24.19.0, Temurin Java 21.0.12.1, Firebase CLI 15.30.2,
Firestore emulator 1.22.0 and Storage rules runtime 1.1.3. Only `demo-ecommerce` and
loopback emulator hosts were used. No Firebase login or production writes occurred.

```sh
cd tools/security
npm ci
npm test
```

The captured final outputs are in `evidence/`; original local log digests are recorded
for provenance. No optional tests are marked as passes. Protractor's obsolete scaffold
E2E, Android/device tests, production auth/rules and payment/stock behavior were not
validated. User-visible production functionality is not certified by these tests.

## Change review

- Firebase identity now drives cart/wishlist reads and writes; logout/account switches
  unsubscribe old listeners and clear visible data. Storage cannot grant identity.
- Client guards restrict private/admin routes; staged rules enforce server ownership
  and admin claims when separately reviewed/deployed. No live rules claim is made.
- Cart quantities persist, clamp to 1–99 and roll back failed edits. Estimates use
  integer cents, aggregate quantity, and charge no shipping on an empty cart.
- Data mapping is inside services/adapters. IDs come from document snapshots;
  legacy numeric prices, timestamps and misspelled descriptions are normalized.
- Catalog/category streams tear down on navigation; selected-category changes cancel
  old reads. Upload/write failures reject properly and reach visible feedback.
- Signup distinguishes failed profile storage after successful account creation;
  login preserves guarded destinations. Direct `/good` no longer dereferences undefined.
- Fourteen unused direct dependencies removed; retained lock package versions did not
  change. Capacitor and its actual native wrapper remain. CLI moved to devDependencies.
- Automatic hosting deployments are paused in both legacy workflows; new CI is
  validation-only with read-only repository permissions and no deployment secrets.

## Publication blocker

Action 1: `git push -u origin enterprise-upgrade/phase-0` to
`https://github.com/AbdullahOmaar/E-Commerce.git` failed because no terminal GitHub
credential is available (`could not read Username`, terminal prompts disabled).

Action 2: GitHub connector create-branch request at the exact baseline SHA failed:
HTTP **403**, `Resource not accessible by integration` (Git refs API).
The connected account is **abdullah-omar1**; repository metadata reports `pull: true`,
`push: false`, `admin: false`. The original `master` SHA is unchanged.

Smallest owner action: grant the connected GitHub identity/integration write access
(`Contents: write`) to `AbdullahOmaar/E-Commerce`, or reconnect the repository's owning
account with that access. The publication path also needs permission to update workflow
files and open pull requests; these capabilities cannot be verified until repository
write access is restored. Do not send a token in chat.

After access is available: verify master has not moved, push the preserved branch,
create a **Draft** PR into `master` using DRAFT_PR.md, and inspect exact-commit CI.
Do not merge or deploy. Begin the separate Phase 1 Angular 22 shell after the Phase 0
handoff is published. No permanent worker or background continuation is claimed.
