import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { restoreCart, serializeCart } from './cart.codec';
import { clampQuantity, immutableLine, MAX_LINES, validProduct } from './cart.models';
import type { CartLine, CartProduct, CheckoutItem } from './cart.models';
import { CartPersistence } from './cart.persistence';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly persistence = inject(CartPersistence);
  private readonly state = signal<readonly CartLine[]>(Object.freeze([]));
  private readonly canPersist = signal(this.persistence.available);
  private readonly correctedState = signal(false);
  private readonly persistenceEnabled: boolean;

  readonly lines = this.state.asReadonly();
  readonly persistenceAvailable = this.canPersist.asReadonly();
  readonly restoredWithCorrections = this.correctedState.asReadonly();
  readonly lineCount = computed(() => this.lines().length);
  readonly itemCount = computed(() =>
    this.lines().reduce((count, line) => count + line.quantity, 0),
  );
  readonly subtotalEstimateMinor = computed(() =>
    this.lines().reduce((total, line) => total + line.unitPriceMinor * line.quantity, 0),
  );
  // No tax/shipping policy has been confirmed. Unknown costs must not appear as free.
  readonly shippingEstimateMinor = computed<number | null>(() => (this.lineCount() ? null : 0));
  readonly taxEstimateMinor = computed<number | null>(() => (this.lineCount() ? null : 0));
  readonly totalEstimateMinor = computed(
    () =>
      this.subtotalEstimateMinor() +
      (this.shippingEstimateMinor() ?? 0) +
      (this.taxEstimateMinor() ?? 0),
  );
  readonly hasUnestimatedCosts = computed(
    () => this.shippingEstimateMinor() === null || this.taxEstimateMinor() === null,
  );

  constructor() {
    let canWrite = this.persistence.available;
    if (this.persistence.available) {
      try {
        const restored = restoreCart(this.persistence.read());
        this.state.set(restored.lines);
        this.correctedState.set(restored.corrected);
      } catch {
        canWrite = false;
        this.canPersist.set(false);
      }
    }
    // An unreadable saved cart is unknown; never replace it with an empty cart.
    this.persistenceEnabled = canWrite;
    effect(() => {
      const lines = this.lines();
      if (!this.persistenceEnabled) return;
      try {
        this.persistence.write(serializeCart(lines));
        this.canPersist.set(true);
      } catch {
        // A blocked/quota-full browser must not discard the user's optimistic changes.
        this.canPersist.set(false);
      }
    });
  }

  add(product: CartProduct, quantity = 1): boolean {
    if (!validProduct(product)) return false;
    const current = this.lines();
    const previous = current.find((line) => line.productId === product.productId);
    if (!previous && current.length >= MAX_LINES) return false;
    const updated = immutableLine(product, (previous?.quantity ?? 0) + clampQuantity(quantity));
    this.state.set(
      Object.freeze(
        previous
          ? current.map((line) => (line.productId === product.productId ? updated : line))
          : [...current, updated],
      ),
    );
    return true;
  }

  setQuantity(productId: string, quantity: number): boolean {
    const line = this.lines().find((item) => item.productId === productId);
    if (!line) return false;
    const clamped = clampQuantity(quantity);
    if (line.quantity !== clamped) {
      this.state.set(
        Object.freeze(
          this.lines().map((item) =>
            item.productId === productId ? immutableLine(item, clamped) : item,
          ),
        ),
      );
    }
    return true;
  }

  increment(productId: string): boolean {
    const line = this.lines().find((item) => item.productId === productId);
    return line ? this.setQuantity(productId, line.quantity + 1) : false;
  }

  decrement(productId: string): boolean {
    const line = this.lines().find((item) => item.productId === productId);
    return line ? this.setQuantity(productId, line.quantity - 1) : false;
  }

  remove(productId: string): void {
    const next = this.lines().filter((line) => line.productId !== productId);
    if (next.length !== this.lineCount()) this.state.set(Object.freeze(next));
  }

  clear(): void {
    if (this.lineCount()) this.state.set(Object.freeze([]));
  }

  toCheckoutPayload(): CheckoutItem[] {
    return this.lines().map((line) => ({ productId: line.productId, quantity: line.quantity }));
  }
}
