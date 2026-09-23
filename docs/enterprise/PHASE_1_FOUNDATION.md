# Phase 1 foundation checkpoint

Date: 2026-09-23. Branch: `enterprise-upgrade/phase-1`.
Base: published Phase 0 `5e4cb68f3c6bb0ecce63603d51e7fa9aec96ba56` (Draft PR #1).

## Completed scope

The independent `apps/storefront` application builds and tests on Angular 22 without
changing the legacy application, Hosting output or native packaging. This is a
foundation checkpoint, not a feature-complete replacement or a production cutover.
The visible shop page explicitly identifies the preview and unavailable purchases.

- Standalone `bootstrapApplication`, `app.config.ts`, `app.routes.ts`, zoneless
  change detection, OnPush components, lazy layout and catalog routes.
- Explicit strict TypeScript/templates, unchecked-index and exact-optional checks.
- Feature routes under `features/catalog`, core error feedback, a shared 404 and a
  reusable layout. Feature/domain/data folders are added when they contain real code.
- Signal-based, sanitized global error feedback; Angular diagnostics remain available.
  Bootstrap failure also displays an accessible message.
- Semantic navigation, current-page indication, skip link, focus management on
  navigation/dismissal, visible keyboard focus and responsive layout.
- ESLint 10 and Angular template accessibility rules. Import rules reject Firebase
  and concrete adapters in presentation, and data adapters in domain modules.
- Vitest plus the real Angular router harness in jsdom. Separate read-only CI builds,
  tests, lints and checks formatting and bundle budgets.
- Independent lockfile, Node runtime, browser target, output and cache directories.

The first build found inherited legacy Browserslist targets. Generating the Angular 22
browser configuration locally fixed that unintended coupling: `baseline widely
available on 2026-05-07`. The final build has no unsupported-browser or bundle warnings.
The unused generated Forms dependency and Angular welcome template/icon were removed.

## Verified dependency matrix

| Package/runtime | Installed version |
| --- | --- |
| Node / npm | 24.19.0 / 11.9.0 |
| Angular framework | 22.1.7 |
| Angular CLI / build | 22.1.8 |
| TypeScript / RxJS | 6.0.3 / 7.8.2 |
| ESLint / angular-eslint | 10.11.0 / 22.5.0 |
| Vitest | 4.1.11 |

Framework and CLI patch versions are independently released: framework 22.1.8 was
not published when checked, so the framework remains 22.1.7. Installation resolves
compatible peers without override flags. ESLint 9 emitted an end-of-support warning;
the workspace uses the compatible supported major 10 instead.

AngularFire remains 20.1.0 with Angular 20 peer constraints. It is not installed here.
The modular Firebase SDK will be added with the first repository adapter, rather
than installing an unused SDK or forcing incompatible AngularFire peers.

## Validation

Executed from `apps/storefront` after a clean `npm ci` (478 packages):

| Gate | Result |
| --- | --- |
| Clean dependency install | PASS |
| ESLint, including template accessibility rules | PASS, zero warnings |
| Prettier check | PASS |
| Vitest / router harness | PASS, 5 tests |
| Production build / budgets | PASS |
| Negative import-boundary probes | PASS, rejected UI-to-Firebase and domain-to-adapter imports |
| Whitespace check | PASS |

The five tests cover lazy root navigation, the historical `/home` entry, unknown
routes and return navigation, skip-link behavior, and sanitized global error
feedback/dismissal. These are DOM-emulated tests; no full browser/device or
assistive-technology certification is claimed.

Production initial JavaScript/CSS: **225.69 kB**, estimated transfer **61.35 kB**.
Lazy chunks include the layout (3.89 kB), preview catalog (1.44 kB), not-found page
and catalog routes. Warning budget: 250 kB; hard limit: 350 kB. These measurements
describe the small shell and cannot be compared as feature-equivalent improvements
against the fully populated legacy app.

Captured local outputs are in `evidence/phase1-*.txt`. GitHub Actions results will
be linked from the Draft PR for its exact published head.

## Routes and remaining migration

The new shell accepts `/`, `/home` and `/shop`; the first two redirect to `/shop`.
Other paths render the new 404. This is safe only because the root app remains the
active Hosting/native target. The legacy app still owns product detail, cart,
wishlist, login, signup, filter and admin behavior.

No live Firebase requests, data migration, Firebase enforcement, merge or deployment
was performed. Catalog/auth/cart are not migrated; no trusted checkout exists.
Observability integration, complete WCAG review and native compatibility remain open.

Next vertical slice: define feature-owned Product/ProductRepository contracts,
preserve category plus product identity from `goods/{category}/item/{id}`, and add
a mapped Firebase adapter tested against emulators/offline fixtures. Then migrate
catalog reads and Signal cart behavior. Before any cutover, require route parity,
trusted checkout validation and explicit owner approval.
