export const MAX_QUANTITY = 99;
export const MAX_LINES = 100;
export const MAX_PRICE_MINOR = 1_000_000_000;
export const MAX_PERSISTED_CHARACTERS = 128 * 1024;

export interface CartProduct {
  readonly productId: string;
  readonly name: string;
  readonly unitPriceMinor: number;
}

export interface CartLine extends CartProduct {
  readonly quantity: number;
}

export interface CheckoutItem {
  readonly productId: string;
  readonly quantity: number;
}

export function clampQuantity(quantity: number): number {
  return Number.isFinite(quantity) ? Math.max(1, Math.min(MAX_QUANTITY, Math.trunc(quantity))) : 1;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validProduct(value: unknown): value is CartProduct {
  if (!isRecord(value)) return false;
  const id = value['productId'];
  const name = value['name'];
  const price = value['unitPriceMinor'];
  return (
    typeof id === 'string' &&
    id.trim() === id &&
    id.length > 0 &&
    id.length <= 512 &&
    !/[\\/]/u.test(id) &&
    [...id].every((character) => character.charCodeAt(0) > 31 && character.charCodeAt(0) !== 127) &&
    typeof name === 'string' &&
    name.trim().length > 0 &&
    name.length <= 300 &&
    typeof price === 'number' &&
    Number.isSafeInteger(price) &&
    price >= 0 &&
    price <= MAX_PRICE_MINOR
  );
}

export function immutableLine(product: CartProduct, quantity: number): CartLine {
  return Object.freeze({
    productId: product.productId,
    name: product.name.trim(),
    unitPriceMinor: product.unitPriceMinor,
    quantity: clampQuantity(quantity),
  });
}
