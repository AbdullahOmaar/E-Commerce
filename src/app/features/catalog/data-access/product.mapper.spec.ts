import { mapProduct } from './product.mapper';

describe('Legacy product mapper', () => {
  it('uses the document ID and reads the legacy description without leaking the typo', () => {
    const product = mapProduct('real-id', { id: 'spoofed-id', discription: 'Legacy', price: '12.50', amount: -3 });
    expect(product.id).toBe('real-id');
    expect(product.description).toBe('Legacy');
    expect(product.price).toBe(12.5);
    expect(product.amount).toBe(1);
    expect(Object.keys(product)).not.toContain('discription');
  });
  it('normalizes a timestamp and rejects a malformed price', () => {
    const product = mapProduct('id', { date: { seconds: 100 }, price: 'invalid' });
    expect(product.date.getTime()).toBe(100000);
    expect(product.price).toBe(0);
  });
});
