# Enterprise modernization baseline

Audit date: 2026-09-22. Repository: `AbdullahOmaar/E-Commerce`.
Baseline: `master` at `d0a34afed4e2c071cfa91cbb94c154c42aafda72`.
Working branch: `enterprise-upgrade/phase-0`. No production access or deployment.

## Scope and evidence

Inspected the complete tracked-file inventory (192 files), all application TypeScript,
templates, styles, tests, package/lock files, Angular/Firebase/Capacitor configuration,
Android build configuration, and both GitHub Actions workflows. No AGENTS.md exists.
Generated `www/` is tracked; source assets directory is absent. Existing source has
16 components, six services, eagerly loaded routes, Angular 10.1, CLI 10.2,
AngularFire 5.4, Firebase 7.22, RxJS 6.6, PrimeNG 10, Bootstrap 4 and Capacitor 2.

## Findings at baseline

| Priority | Area/evidence | Verified behavior | Stabilization / later boundary |
| --- | --- | --- | --- |
| P0 | `services/auth.service.ts` | Service relies on ngOnInit, which Angular does not invoke for services. Mutable UID also comes from localStorage. | Firebase auth stream must be the only identity authority. |
| P0 | `services/cart.service.ts` | Add/read use AuthService UID; update/delete use a constructor-cached localStorage UID. | Resolve current authenticated UID for every operation; switch reads on identity changes. |
| P0 | `services/wishlist.service.ts` | Wishlist permanently captures old UID; signed-out paths can contain null. | Same ownership boundary as cart. |
| P0 | `app-routing.module.ts` | Admin, cart and wishlist have no guards. | Auth/custom-claim guards for UX; server rules still required. |
| P0 | Repository security configuration | No Firestore or Storage rules are version-controlled. **Live rules were not read and their security is unknown.** | Add staged, emulator-validated rules; do not deploy to production. |
| P0 | Backend | No trusted checkout backend or order transaction exists. | Client prices are estimates only; implement authoritative checkout in Phase 6. |
| P1 | `cart.component.html` | Subtotal and total display cart.length; quantity input has no persistence event. | Tested integer-cent estimates, bounded quantities, persistence/error feedback. |
| P1 | Components | Manual live subscriptions are not torn down. Shop repeats ngOnInit on every selection. | Teardown plus switchMap for category changes. |
| P1 | Navbar | Provides/injects a separate ShopComponent instance and mutates AuthService identity. | Shared category state; read-only auth state. |
| P1 | Goods/category services | Nested promises omit rejection paths; download URL subscriptions leak. Success says “Product Deleted” after creation. | Async/await with finite download reads; feedback at UI boundary. |
| P1 | Product detail | Direct `/good` navigation redirects then dereferences undefined. | Return after redirect; stable product URLs are a later migration. |
| P1 | Firestore data mapping | UI consumes DocumentChangeAction; casts snapshots as GoodsService. Spread data can replace document ID. | Typed mappers inside data services, authoritative snapshot ID. |
| P1 | Build/dependencies | Gatsby, React, react-dom, mobile, save, cordova-create, chokidar, core-js and unused FontAwesome Angular/ng-bootstrap packages have no application use. | Remove verified unused direct dependencies; preserve Bootstrap CSS, font-awesome CSS and native Capacitor tooling. |
| P1 | CI workflows | Both run bare `npm`, neither installs/builds/tests. Merge workflow deploys tracked www to live. | Validation-only PR workflow; disable automatic deployment while migration is reviewed. |
| P1 | Models | Good includes misspelled discription; most fields optional; amount/quantity semantics unclear. | Explicit legacy mapper; feature models in modern shell later. |
| P2 | AppModule | BrowserModule appears three times; animations, Menubar, Table and Accordion duplicated. Firebase config inline. | Deduplicate; environment-level public Firebase config. |
| P2 | Error paths | Console-only errors and unreachable code after return; signup appends “ss”. | User-visible safe errors; no raw backend data in messages. |
| P2 | Routes | `/home` only works via wildcard; wildcard renders home instead of NotFound. | Explicit redirect and 404 route; guarded navigation tests. |
| P2 | Catalog | Full collection snapshots; PrimeNG pagination/search is client-only. | Cursor pagination belongs to Phase 5. |
| P2 | Product UX | Orders/payment links and some buttons are placeholders; no actual orders/checkout. | Do not present placeholders as working commerce. |
| P2 | Accessibility | Clickable spans/icons, repeated input IDs, missing labels; loading/error states incomplete. | Fix touched flows; full WCAG review in later phase. |
| P2 | Android | Capacitor 2, SDK 29, Gradle 4.1.1 plugin, jcenter; native app is real, not a dead dependency. | Separate native upgrade and device verification required. |

## Initial validation

- Host is Node 24.19/npm 11.9, outside Angular 10's historical supported range.
- `npm ci --ignore-scripts --no-audit --no-fund`: PASS, 3,004 packages. Ignoring
  lifecycle scripts isolates installation from unused legacy native dependencies.
- Isolated Node 12.22.12/npm 6.14.18 obtained for historical baseline only; both are
  EOL and are **not** a target runtime.
- `ng lint`: FAIL, 533 reported violations. Existing TSLint rules retained.
- Production compilation and browser unit baseline: results recorded in VALIDATION.md
  after completion. Baseline uses a detached worktree at the exact SHA above.
- Existing generated service/component tests do not provide required Firebase/router
  dependencies. Protractor still asserts an Angular scaffold message absent from the app.
- No live Firebase data, production rules, credentials, admin claims, or hosting state
  were queried or modified. No native/device build or payment processing is verified.

## Current phase boundary

Phase 0 fixes the existing application without changing the Angular major, Firestore
collection layout, native package baseline or live infrastructure. Signals, standalone
bootstrap, trusted checkout and feature-complete commerce are later deliverables, not
claimed by this stabilization change. See MIGRATION.md for the next shell decision.
