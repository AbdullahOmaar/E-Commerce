import { restoreCart, serializeCart } from './cart.codec';
import { immutableLine, MAX_LINES, MAX_PERSISTED_CHARACTERS, validProduct } from './cart.models';

const line = { productId: 'category:p1', name: 'Product', unitPriceMinor: 100, quantity: 2 };
const encode = (lines: unknown[]) => JSON.stringify({ version: 1, lines });

describe('untrusted persisted cart validation', () => {
  it('round-trips a full valid cart even when JSON must escape every character', () => {
    const lines = Array.from({ length: MAX_LINES }, (_, index) =>
      immutableLine(
        {
          productId: String(index).padStart(3, '0') + '\ud800'.repeat(509),
          name: '\u0000'.repeat(299) + 'X',
          unitPriceMinor: 1_000_000_000,
        },
        99,
      ),
    );
    expect(lines.every(validProduct)).toBe(true);
    const serialized = serializeCart(lines);
    expect(serialized.length).toBeLessThanOrEqual(MAX_PERSISTED_CHARACTERS);
    expect(restoreCart(serialized)).toEqual({ lines, corrected: false });
  });

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
