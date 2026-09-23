# E-Commerce

Angular 10 storefront with Firebase and a Capacitor Android wrapper. Enterprise
modernization is underway; this branch stabilizes the legacy application first.
It is not yet a production-ready commerce/payment backend.

## Local legacy checks

Use the version in `.nvmrc` (Node 12.22.12, npm 6.14.18) only to reproduce the historical
Angular compiler. Both are EOL; see the Angular 22 migration decision below.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm run test:ci
npm run build:production
```

Karma needs Chrome/Chromium. Set `CHROME_BIN` if it is not discoverable. `npm start`
runs the legacy app against its existing Firebase client configuration; do not use
live accounts/data for automated tests. Builds generate `www/`, also used by Capacitor.

## Security verification

Use Node 24 and Java 21 in `tools/security/`, then run `npm ci` and `npm test`.
The suite uses only the `demo-ecommerce` Firestore/Storage emulators. Rules are staged
in `firebase.security.json`; no automatic rules or hosting deployment is configured.

## Review documents

- [Fresh baseline audit](docs/enterprise/BASELINE.md)
- [Validation results and publication status](docs/enterprise/VALIDATION.md)
- [Angular 22 migration decision](docs/enterprise/MIGRATION.md)
- [Staged Firebase rules and App Check rollout](docs/enterprise/SECURITY.md)
- [Prepared Draft PR description](docs/enterprise/DRAFT_PR.md)

Do not merge or deploy without explicit owner approval. The repository's live Firebase
rules, production data, payment flow and native device behavior have not been verified.
