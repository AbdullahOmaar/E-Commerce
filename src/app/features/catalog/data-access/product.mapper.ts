import { DocumentChangeAction } from '@angular/fire/firestore';
import { Good } from '../../../interface/good';
import { clampQuantity } from '../../cart/domain/cart-estimates';

type LegacyGoodDto = Omit<Partial<Good>, 'price' | 'date'> & { discription?: string; price?: unknown; date?: unknown };

function mapDate(value: unknown): Date | undefined {
  if (value instanceof Date) { return Number.isFinite(value.getTime()) ? value : undefined; }
  if (value && typeof value === 'object' && typeof (value as { seconds?: unknown }).seconds === 'number') {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return undefined;
}

/** Legacy Firestore compatibility belongs here, never in a template. */
export function mapProduct(id: string, dto: LegacyGoodDto): Good {
  const price = typeof dto.price === 'string' ? Number(dto.price) : dto.price;
  const { discription, ...data } = dto;
  return {
    ...data,
    id,
    date: mapDate(dto.date),
    description: typeof dto.description === 'string' ? dto.description : discription || '',
    price: typeof price === 'number' && Number.isFinite(price) && price >= 0 ? price : 0,
    ...(dto.amount !== undefined ? { amount: clampQuantity(dto.amount) } : {})
  };
}

export function mapProducts(actions: DocumentChangeAction<Good>[]): Good[] {
  return actions.map(action => mapProduct(action.payload.doc.id, action.payload.doc.data()));
}
