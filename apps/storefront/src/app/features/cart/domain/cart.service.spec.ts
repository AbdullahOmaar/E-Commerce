import { TestBed } from '@angular/core/testing';
import { CartPersistence } from './cart.persistence';
import { CartService } from './cart.service';
import { MAX_LINES } from './cart.models';
import type { CartProduct } from './cart.models';

const product: CartProduct = {
  productId: 'men:shirt-1',
  name: 'Cotton shirt',
  unitPriceMinor: 1010,
};

function setup(serialized: string | null = null, available = true) {
  const persistence = {
    available,
    read: vi.fn(() => serialized),
    write: vi.fn<(value: string) => void>(),
  };
  TestBed.configureTestingModule({
    providers: [{ provide: CartPersistence, useValue: persistence }],
  });
  return { cart: TestBed.inject(CartService), persistence };
}

describe('Signal cart invariants and persistence', () => {
  it('starts empty with zero counts and no shipping or tax on an empty cart', () => {
    const { cart } = setup();
    expect(cart.lines()).toEqual([]);
    expect([cart.itemCount(), cart.lineCount(), cart.totalEstimateMinor()]).toEqual([0, 0, 0]);
    expect([cart.shippingEstimateMinor(), cart.taxEstimateMinor()]).toEqual([0, 0]);
  });

  it('updates synchronously, combines duplicate products and calculates integer-minor-unit estimates', () => {
    const { cart } = setup();
    cart.add(product, 2);
    cart.add(product, 3);
    cart.add({ ...product, productId: 'women:shirt-1', unitPriceMinor: 20 }, 2);
    expect(cart.itemCount()).toBe(7);
    expect(cart.lineCount()).toBe(2);
    expect(cart.subtotalEstimateMinor()).toBe(5090);
    expect(cart.totalEstimateMinor()).toBe(5090);
    expect(cart.hasUnestimatedCosts()).toBe(true);
    expect(cart.shippingEstimateMinor()).toBeNull();
    expect(cart.taxEstimateMinor()).toBeNull();
  });

  it('uses a fresh snapshot when the same product is added again', () => {
    const { cart } = setup();
    cart.add(product);
    cart.add({ ...product, name: 'New name', unitPriceMinor: 1200 });
    expect(cart.lines()).toEqual([
      { ...product, name: 'New name', unitPriceMinor: 1200, quantity: 2 },
    ]);
  });

  it.each([
    [-3, 1],
    [0, 1],
    [1.9, 1],
    [1000, 99],
    [Number.NaN, 1],
    [Infinity, 1],
  ])('clamps quantity %s to %s', (input, expected) => {
    const { cart } = setup();
    cart.add(product);
    cart.setQuantity(product.productId, input);
    expect(cart.itemCount()).toBe(expected);
    expect(cart.toCheckoutPayload()[0]?.quantity).toBe(expected);
  });

  it('supports increment, decrement, remove and clear without duplicate lines', () => {
    const { cart } = setup();
    cart.add(product);
    cart.decrement(product.productId);
    expect(cart.itemCount()).toBe(1);
    cart.increment(product.productId);
    expect(cart.itemCount()).toBe(2);
    cart.remove(product.productId);
    expect(cart.lineCount()).toBe(0);
    expect(cart.increment('missing')).toBe(false);
    expect(cart.decrement('missing')).toBe(false);
    expect(cart.setQuantity('missing', 2)).toBe(false);
    cart.add(product);
    cart.clear();
    expect(cart.toCheckoutPayload()).toEqual([]);
    expect(cart.totalEstimateMinor()).toBe(0);
  });

  it('caps combined quantities and the number of distinct lines', () => {
    const { cart } = setup();
    cart.add(product, 98);
    cart.add(product, 20);
    expect(cart.itemCount()).toBe(99);
    for (let i = 1; i < MAX_LINES; i++) cart.add({ ...product, productId: 'p' + i });
    expect(cart.add({ ...product, productId: 'overflow' })).toBe(false);
    expect(cart.lineCount()).toBe(MAX_LINES);
    expect(cart.add(product)).toBe(true);
    expect(cart.lines()[0]?.quantity).toBe(99);
  });

  it('does not expose writable state or retain the caller object', () => {
    const { cart } = setup();
    const input = { ...product };
    cart.add(input);
    input.name = 'mutated';
    expect(cart.lines()[0]?.name).toBe(product.name);
    expect(Object.isFrozen(cart.lines())).toBe(true);
    expect(Object.isFrozen(cart.lines()[0])).toBe(true);
    const payload = cart.toCheckoutPayload();
    payload.pop();
    expect(cart.lineCount()).toBe(1);
  });

  it('serializes changes with an effect and restores them in a new service instance', () => {
    const { cart, persistence } = setup();
    cart.add(product, 2);
    TestBed.tick();
    const serialized = persistence.write.mock.lastCall?.[0];
    expect(serialized).toBeDefined();
    TestBed.resetTestingModule();
    const restored = setup(serialized ?? null).cart;
    expect(restored.toCheckoutPayload()).toEqual([{ productId: product.productId, quantity: 2 }]);
    expect(restored.subtotalEstimateMinor()).toBe(2020);
  });

  it('continues optimistically if storage is unavailable or writes fail', () => {
    const { cart, persistence } = setup();
    persistence.write.mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(cart.add(product)).toBe(true);
    TestBed.tick();
    expect(cart.lineCount()).toBe(1);
    expect(cart.persistenceAvailable()).toBe(false);
  });

  it('never reads or writes an unsupported persistence adapter (including SSR)', () => {
    const { cart, persistence } = setup(null, false);
    cart.add(product);
    TestBed.tick();
    expect(persistence.read).not.toHaveBeenCalled();
    expect(persistence.write).not.toHaveBeenCalled();
    expect(cart.lineCount()).toBe(1);
  });

  it('recovers from a failing read without failing application bootstrap', () => {
    const persistence = {
      available: true,
      read: () => {
        throw new Error('SecurityError');
      },
      write: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: CartPersistence, useValue: persistence }],
    });
    const cart = TestBed.inject(CartService);
    expect(cart.lines()).toEqual([]);
    expect(cart.persistenceAvailable()).toBe(false);
    TestBed.tick();
    expect(persistence.write).not.toHaveBeenCalled();
    expect(cart.persistenceAvailable()).toBe(false);
    cart.add(product);
    TestBed.tick();
    expect(cart.lineCount()).toBe(1);
    expect(persistence.write).not.toHaveBeenCalled();
  });

  it.each([
    { ...product, productId: '' },
    { ...product, productId: 'invalid/path' },
    { ...product, name: ' ' },
    { ...product, unitPriceMinor: -1 },
    { ...product, unitPriceMinor: 0.1 },
    { ...product, unitPriceMinor: Number.NaN },
    { ...product, unitPriceMinor: Number.MAX_SAFE_INTEGER },
  ])('rejects an invalid product snapshot: %j', (invalid) => {
    const { cart } = setup();
    expect(cart.add(invalid)).toBe(false);
    expect(cart.lines()).toEqual([]);
  });

  it('whitelists checkout fields and never sends display prices, names or totals', () => {
    const { cart } = setup();
    cart.add(product, 2);
    expect(cart.toCheckoutPayload()).toEqual([{ productId: 'men:shirt-1', quantity: 2 }]);
    expect(Object.keys(cart.toCheckoutPayload()[0] ?? {}).sort()).toEqual([
      'productId',
      'quantity',
    ]);
  });
});
