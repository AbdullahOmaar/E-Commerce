# Modern storefront foundation

This isolated Angular 22 workspace is the first migration checkpoint. It does not
replace the root Angular 10 storefront or its native/Hosting build. Its shop page
is explicitly a preview: catalog data, auth, cart and checkout are not migrated yet.

Use Node 24.19.0 (see `.nvmrc`). Run these commands in this directory:

```sh
npm ci
npm start
npm run lint
npm run format:check
npm run test:ci
npm run build:production
```

The development server binds locally on port 4201. Production output is
`dist/storefront/browser`, separate from the legacy `www/` output. No deployment
configuration points to this directory.

- Standalone, zoneless bootstrap with `app.config.ts` and lazy `app.routes.ts`.
- Explicit strict TypeScript/template checks and OnPush components.
- Feature-owned routes; core error feedback; shared 404; accessible layout controls.
- ESLint 10 with Angular template accessibility and import-boundary checks.
- Vitest with the Angular router harness; no live Firebase requests in tests.
- Independent browser support, package lock, Node version, cache and output paths.
- Initial production budgets: 250 kB warning / 350 kB failure. These cover the small
  shell only; do not interpret them as full-catalog performance measurements.

Presentation imports domain contracts. Concrete Firebase adapters belong in each
feature's data-access directory and are provided through dependency injection.
ESLint rejects Firebase/data-access imports in feature UI, shared components and
layouts, and adapter imports in domain files. Add directories when real code needs
them; do not create placeholder models or empty services.

AngularFire 20.1.0 declares Angular 20 peers, so it is deliberately not installed in
this Angular 22 workspace. Add the modular Firebase SDK with the first data adapter;
never force incompatible peers. Product identity must retain the legacy category
and document ID; a bare product document ID is not globally unique in this schema.

See [the foundation checkpoint](../../docs/enterprise/PHASE_1_FOUNDATION.md) for the
exact validation scope, unmigrated routes and next acceptance criteria.
