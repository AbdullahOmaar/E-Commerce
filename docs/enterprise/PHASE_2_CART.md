# Phase 2: Signal cart checkpoint

Date: 2026-09-23. Branch: `enterprise-upgrade/phase-2`.
Base: Phase 1 `594e053b4e71c2fa37da41c61ddb536f2a2a7ada` (Draft PR #2).

## Implemented behavior

The modern cart is a guest/browser cart with a single private Signal as its source
of truth. UI depends on the domain CartService; that service depends on a domain-owned
CartPersistence port. BrowserCartPersistence supplies the platform-specific adapter.
No Firebase SDK or browser storage access exists in the presentation components.

- Immutable, frozen snapshots; computed lineCount, itemCount, subtotal and total estimates.
- Add, remove, clear, increment, decrement and setQuantity; updates are synchronous.
- One line per productId, quantities 1–99, at most 100 distinct lines.
- Prices stored as integer minor units (0–1,000,000,000 per item); sums stay inside
  safe-integer bounds. These are display estimates, not authoritative prices.
- Versioned localStorage in `ecommerce.storefront.cart.v1`. Existing legacy storage
  and Firestore carts are untouched; no automatic account-cart merge is implied.
- Runtime validation before restore: schema/version, types, IDs, name/price bounds,
  integer quantities, duplicate consolidation, a line limit and a 128 Ki-character
  input limit. Invalid data is corrected/dropped with visible feedback.
- PLATFORM_ID/isPlatformBrowser guards before reading DOCUMENT/localStorage. Server
  tests prove the browser document is never touched by the storage adapter.
- An effect handles persistence only. Storage failure keeps in-memory changes
  available and displays a warning. If the initial read throws, persistence stays
  disabled for that service lifetime so unreadable saved data is not overwritten.
- Lazy `/cart`, live item count, named quantity controls, input normalization, an
  empty state, clear/remove actions, focus return and estimated totals.

No variant model was found in the verified legacy types/routes. Variant IDs are not
invented. The upcoming ProductRepository must provide a globally unique productId
that preserves category plus document identity; two categories can have the same
Firestore document ID. Cart tests explicitly keep distinct supplied IDs separate.

## Checkout boundary

`toCheckoutPayload()` creates new objects containing **only**:

```json
[
  { "productId": "opaque-product-id", "quantity": 2 }
]
```

No name, display price, tax, shipping, computed total or trusted-price flag is included.
Local storage and the browser are untrusted even after runtime validation. The future
backend must authenticate the caller, validate IDs/quantities, read current prices
and stock, and create the order in a transaction.

Shipping and tax policies are unconfirmed: they are `null` for a nonempty cart and
zero for an empty cart. The visible total is explicitly **before shipping and tax**.
Unknown costs are not presented as free. USD display preserves the old CurrencyPipe
default; confirm the store currency and pricing policy before trusted checkout.

## Validation

| Gate | Result |
| --- | --- |
| Modern Vitest/router tests | PASS: 45 tests across 5 files |
| ESLint / template accessibility rules | PASS, zero warnings |
| Prettier check | PASS |
| Production build / bundle budgets | PASS |
| Git whitespace check | PASS |

A regression test first reproduced a destructive edge case: a failed storage read
was followed by an automatic empty-cart write (1 failed / 23 passed in the focused
service run). The implementation now disables persistence after that read failure;
the same assertion and subsequent in-memory edits pass without any storage write.

Tests cover quantity clamping, integer arithmetic, duplicate/cap handling, immutable
snapshots, round-trip persistence, malformed/oversized data, blocked storage, SSR,
payload field whitelisting, routed empty/populated UI, and numeric input reset when
the clamped Signal value is unchanged.

Production initial size: **245.29 kB**, estimated transfer **67.51 kB**.
Cart page lazy chunk: **7.24 kB**. Both existing 250 kB warning / 350 kB error budgets
pass unchanged; initial warning headroom is now limited. No full-catalog performance
claim or browser/assistive-technology certification is made.

GitHub Actions run links and the exact published head are recorded in the Draft PR.
No dependency version, root legacy source, native target, Firebase rule or Hosting
configuration was changed by this phase.

## Remaining work

This is still an isolated preview. Catalog data/add-to-cart integration, account
cart reconciliation, auth, wishlist/orders and trusted checkout are not migrated.
The cart does not submit orders, reserve stock, collect payment or trust client totals.
Next: implement ProductRepository and the legacy mapper with category-aware identity,
then connect paginated catalog UI to CartService. Keep all PRs Draft until reviewed;
do not merge or deploy without the owner's explicit approval.
