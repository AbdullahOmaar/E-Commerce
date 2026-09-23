import { cartEstimates, clampQuantity } from './cart-estimates';

describe('Cart display estimates', () => {
  it('multiplies quantities and includes shipping once', () => {
    expect(cartEstimates([{ price: 12.5, amount: 2 }, { price: 3, amount: 4 }])).toEqual({
      itemCount: 6, lineCount: 2, subtotal: 37, shipping: 30, total: 67
    });
  });
  it('charges no shipping on an empty cart', () => {
    expect(cartEstimates([])).toEqual({ itemCount: 0, lineCount: 0, subtotal: 0, shipping: 0, total: 0 });
  });
  it('uses integer cents and ignores malformed prices', () => {
    expect(cartEstimates([{ price: 0.1, amount: 1 }, { price: 0.2, amount: 1 }]).subtotal).toBe(0.3);
    expect(cartEstimates([{ price: NaN }, { price: -5 }, { price: Infinity }]).subtotal).toBe(0);
  });
  it('clamps missing, non-finite, fractional, negative and excessive quantities', () => {
    expect([undefined, NaN, Infinity, -2, 0, 1.9, 999].map(clampQuantity)).toEqual([1, 1, 1, 1, 1, 1, 99]);
  });
});
