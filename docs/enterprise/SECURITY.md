# Staged Firebase security

The application points to the existing public Firebase client configuration.
These identifiers are not server credentials. Production data/rules were not read
or modified, and no production deployment occurred.

`firestore.rules` and `storage.rules` describe the current collection layout:
public catalog reads, admin custom-claim catalog/image writes, UID-owned carts,
wishlists and profiles, backend-only orders, and default denial elsewhere.
Cart price fields remain untrusted display metadata. They cannot create an order.

The separate `firebase.security.json` configuration is used only by emulator tests
with `--project demo-ecommerce`. It is deliberately not wired into `firebase.json`
or an automatic deployment workflow. Validate actual production schemas and claim
provisioning before any future rollout; existing unrelated collections would be
blocked by default denial. Rule tests are real Firestore and Storage emulator tests,
not a JavaScript reimplementation of rule logic.

Run from `tools/security/` with Node 24 and Java 21:

```sh
npm ci
npm test
```

The tests cover ownership, cross-account/anonymous denials, admin claim type,
quantity bounds, profile privilege escalation, order query scope and blocked
client order creation/updates, image type/size, and default denial. Test logs include
expected PERMISSION_DENIED entries from negative cases. No login is required.

## App Check rollout

The legacy Firebase 7 SDK predates the modern App Check integration. Do not enforce
App Check while clients lack token support. During the modern Firebase adapter work:

1. Register non-production web/native apps and approved providers (including a
   separate review for Capacitor/native attestation); keep debug tokens out of source.
2. Integrate App Check before data/function access with auto-refresh, leaving
   enforcement off. Authentication and authorization rules remain mandatory.
3. Monitor valid/invalid/unknown traffic, expiry, refresh, privacy-restricted browsers,
   Android builds and older clients. Establish explicit acceptance criteria.
4. Verify all supported client versions and non-production checkout requests.
5. Enable per-service enforcement only after explicit rollout approval; monitor and
   keep a documented rollback. Never substitute App Check for UID/admin authorization.

Official references, accessed 2026-09-22:
https://firebase.google.com/docs/firestore/security/test-rules-emulator
https://firebase.google.com/docs/app-check/monitor-metrics
https://firebase.google.com/docs/app-check/enable-enforcement

No rules can secure a backend that ignores authorization: Admin SDK bypasses rules.
The future checkout function must authenticate, validate product references and
quantities, load prices/stock on the server, atomically decrement stock/create the
order, use server timestamps and support idempotent retries. No payment/order API
is exposed by this Phase 0 application.
