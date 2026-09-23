import {
  clampQuantity,
  immutableLine,
  isRecord,
  MAX_LINES,
  MAX_PERSISTED_CHARACTERS,
  validProduct,
} from './cart.models';
import type { CartLine } from './cart.models';

export interface RestoredCart {
  readonly lines: readonly CartLine[];
  readonly corrected: boolean;
}

export function restoreCart(serialized: string | null): RestoredCart {
  const empty = (corrected: boolean): RestoredCart => ({ lines: Object.freeze([]), corrected });
  if (serialized === null) return empty(false);
  if (serialized.length > MAX_PERSISTED_CHARACTERS) return empty(true);
  try {
    const value: unknown = JSON.parse(serialized);
    if (!isRecord(value) || value['version'] !== 1 || !Array.isArray(value['lines']))
      return empty(true);
    const items: unknown[] = value['lines'];
    const lines = new Map<string, CartLine>();
    let corrected = items.length > MAX_LINES;
    for (const item of items.slice(0, MAX_LINES)) {
      if (!validProduct(item) || !isRecord(item)) {
        corrected = true;
        continue;
      }
      const quantity = item['quantity'];
      if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 1) {
        corrected = true;
        continue;
      }
      const previous = lines.get(item.productId);
      const combined = (previous?.quantity ?? 0) + quantity;
      if (previous || clampQuantity(quantity) !== quantity) corrected = true;
      lines.set(item.productId, immutableLine(item, combined));
    }
    return { lines: Object.freeze([...lines.values()]), corrected };
  } catch {
    return empty(true);
  }
}

export function serializeCart(lines: readonly CartLine[]): string {
  return JSON.stringify({
    version: 1,
    lines: lines.map(({ productId, name, unitPriceMinor, quantity }) => ({
      productId,
      name,
      unitPriceMinor,
      quantity,
    })),
  });
}
