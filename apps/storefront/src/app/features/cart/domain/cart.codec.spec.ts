import { restoreCart } from './cart.codec';
import { MAX_PERSISTED_CHARACTERS } from './cart.models';

const line = { productId: 'category:p1', name: 'Product', unitPriceMinor: 100, quantity: 2 };
const encode = (lines: unknown[]) => JSON.stringify({ version: 1, lines });

describe('untrusted persisted cart validation', () => {
  it.each([
    'bad json',
    'null',
    '[]',
    '{}',
    '{"version":2,"lines":[]}',
    'x'.repeat(MAX_PERSISTED_CHARACTERS + 1),
  ])('resets malformed, incompatible or oversized storage', (value) => {
    expect(restoreCart(value)).toEqual({ lines: [], corrected: true });
  });

  it('drops invalid records, clamps quantities, combines duplicates and ignores extra fields', () => {
    const restored = restoreCart(
      encode([
        null,
        [],
        'bad',
        { ...line, quantity: '2' },
        { ...line, quantity: -1 },
        { ...line, quantity: 1.5 },
        { ...line, unitPriceMinor: '100' },
        { ...line, quantity: 90, admin: true, trustedPrice: 1 },
        { ...line, quantity: 50 },
      ]),
    );
    expect(restored.lines).toEqual([{ ...line, quantity: 99 }]);
    expect(restored.corrected).toBe(true);
    expect(Object.isFrozen(restored.lines[0])).toBe(true);
  });

  it('distinguishes no saved cart from corrected data', () => {
    expect(restoreCart(null)).toEqual({ lines: [], corrected: false });
    expect(restoreCart(encode([line])).corrected).toBe(false);
  });

  it('limits the number of persisted lines before restoring state', () => {
    const restored = restoreCart(
      encode(Array.from({ length: 200 }, (_, i) => ({ ...line, productId: 'p' + i }))),
    );
    expect(restored.lines).toHaveLength(100);
    expect(restored.corrected).toBe(true);
  });
});
