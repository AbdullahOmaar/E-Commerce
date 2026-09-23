# Decision: stabilize, then re-platform one feature at a time

Date: 2026-09-22. Updated: 2026-09-23. Status: isolated Angular 22 shell implemented;
feature migration and production cutover remain pending. See PHASE_1_FOUNDATION.md.

## Evidence and decision

Choose **B: a separate modern shell inside this repository**, initially in
`apps/storefront/`, with its own package lock, Angular configuration and `src/app/`.
Keep the root Angular 10 application and Android packaging runnable until feature
parity is verified. The final modern application uses the requested core/shared/
features/layouts structure. Do not move or remove legacy source as a prerequisite.

The existing application has 16 components and six services, but 12 Angular major
transitions, AngularFire 5, PrimeNG 10, Capacitor 2, TSLint and Protractor to reconcile.
Its Firestore collections and Android wrapper are real compatibility requirements.
Migrating all intermediate majors would couple framework, SDK, UI and native changes
without a reliable baseline. Phase 0 establishes that baseline. A parallel shell
allows route-by-route comparison and reversible cutover, with a small temporary
cost of maintaining two build targets. This is a repository-specific inference,
not a universal recommendation to rewrite Angular applications.

## Verified package gate

Official Angular documentation and the package registry were read during this audit:

- Angular 22 is actively supported; the registry reports `@angular/core` 22.1.7.
- Angular 22 requires Node `^22.22.3 || ^24.15.0 || ^26.0.0`, TypeScript
  `>=6.0.0 <6.1.0`, and RxJS `^6.5.3 || ^7.4.0`. Prefer Node 24 and RxJS 7.8.
- The registry currently reports `@angular/fire` **20.1.0**, whose Angular peers are
  `^20.0.0`; this is not evidence of Angular 22 compatibility. Never force peer
  installation or mix Angular majors to satisfy the preferred target.
- Prefer Angular 22 with the supported modular Firebase JS SDK behind injected
  repository adapters. AngularFire is optional. Recheck its published peer ranges
  when Phase 1 starts; use it only when it supports the chosen Angular major.
- The root `.nvmrc` is intentionally the historical compiler runtime (Node 12.22.12),
  not the enterprise target. Node 12, Angular 10 and the root tooling are EOL.
  `tools/security/` is independently locked and runs with Node 24 / Java 21.

Sources (accessed 2026-09-22):
https://angular.dev/reference/releases
https://angular.dev/reference/versions
https://angular.dev/guide/testing
https://github.com/angular/angularfire
Registry commands: `npm view @angular/core version`, `npm view @angular/fire version peerDependencies --json`.

## First modern vertical slice

1. Create the isolated Angular 22 standalone shell with strict TypeScript/template
   checks, `app.config.ts`, `app.routes.ts`, lazy feature routes, ESLint and Vitest.
   Keep legacy hosting/native output unchanged. Validate the empty shell build.
2. Add domain-owned ProductRepository and its InjectionToken. The Firebase adapter
   implements the interface and maps the legacy `goods/{category}/item/{id}` DTO.
   UI imports the contract; the domain does not import Firebase. Runtime requests
   flow UI -> domain contract -> injected data adapter; code dependencies point inward.
3. Port read-only catalog and stable product detail routes with category-aware IDs,
   cursor pagination and cancellation. Prove parity against offline fixtures.
4. Add the Signal cart with immutable state, validated browser-only persistence,
   quantity bounds, variant-aware deduplication and a payload containing only product
   references and quantities. Reconcile legacy cart duplicates explicitly; do not
   silently overwrite or delete user documents. Cart prices stay display estimates.
5. Add Auth, validated security adapter, server checkout transaction, wishlist/orders
   and the remaining UX in their requested order. No migration is production-ready
   until the trusted checkout, concurrency/idempotency tests and stock schema exist.

## Compatibility and rollback

- Preserve current routes (`/`, `/home`, `/shop`, `/good`, `/cart`, `/wishlist`,
  `/login`, `/signup`, `/admin`, `/filter`) during the transition; add redirect tests
  when replacing `/good` with shareable IDs. `/home` now redirects explicitly.
- Existing names (`goods`, `category`, `DataId`, `amount`) are legacy storage fields.
  Only the data boundary knows these aliases. No production data migration occurred.
- Phase 0 reads both description spellings but publishes only `description` to UI.
- Admin now requires the boolean custom claim `admin: true`; only a trusted Admin
  SDK process may provision claims. A browser profile field cannot grant privileges.
- Existing price/stock documents were not fetched. Currency, tax, shipping rules,
  variants, stock migration and payment provider must be resolved before checkout.
- No auto-deploy workflow remains in this branch. Hosting settings and tracked
  `www/` baseline artifacts are unchanged. Builds use fresh generated output.
- Before any cutover, compare legacy/modern route acceptance tests and Android
  behavior; release only with explicit approval. Revert a feature cutover to the
  prior source/build target, never by rewriting production data.

## Phase 0 limits

No claim of enterprise readiness: catalog reads remain unpaginated, legacy carts
may contain duplicate lines, all routes remain eager, standalone/Signals are not
backported, no backend checkout exists, live rules are unknown, and mobile/device
verification is outstanding. The new rules are staged and emulator-tested only.
