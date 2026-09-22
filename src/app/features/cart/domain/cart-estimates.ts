import { Good } from '../../../interface/good';

export const MAX_CART_QUANTITY = 99;

export function clampQuantity(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) { return 1; }
  return Math.max(1, Math.min(MAX_CART_QUANTITY, Math.trunc(value)));
}

/** Display estimates only. No value from this function authorizes an order/payment. */
export function cartEstimates(lines: ReadonlyArray<Good>): {
  itemCount: number; lineCount: number; subtotal: number; shipping: number; total: number;
} {
  let cents = 0;
  let itemCount = 0;
  for (const line of lines) {
    const amount = clampQuantity(line.amount);
    const price = typeof line.price === 'number' && Number.isFinite(line.price) && line.price >= 0 ? line.price : 0;
    cents += Math.round(price * 100) * amount;
    itemCount += amount;
  }
  const shipping = lines.length ? 30 : 0; // Preserve the existing displayed estimate.
  return { itemCount, lineCount: lines.length, subtotal: cents / 100, shipping, total: (cents + shipping * 100) / 100 };
}
