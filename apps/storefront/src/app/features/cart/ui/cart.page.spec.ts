import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../app.routes';
import { CartPersistence } from '../domain/cart.persistence';
import { CartService } from '../domain/cart.service';

const product = { productId: 'men:shirt-1', name: 'Cotton shirt', unitPriceMinor: 1010 };

describe('cart page controls and estimates', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        {
          provide: CartPersistence,
          useValue: { available: true, read: () => null, write: vi.fn() },
        },
      ],
    });
  });

  it('renders a useful empty state without presenting shipping as a payable charge', async () => {
    const harness = await RouterTestingHarness.create('/cart');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Your cart');
    expect(harness.routeNativeElement?.textContent).toContain('Your cart is empty');
    expect(harness.routeNativeElement?.querySelector('.summary')).toBeNull();
  });

  it('normalizes invalid numeric input even when the stored quantity is already at the limit', async () => {
    const cart = TestBed.inject(CartService);
    cart.add(product, 99);
    const harness = await RouterTestingHarness.create('/cart');
    const input = harness.routeNativeElement?.querySelector('input') as HTMLInputElement;
    input.value = '999';
    input.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable();
    expect(input.value).toBe('99');
    expect(cart.itemCount()).toBe(99);
    input.value = '';
    input.dispatchEvent(new Event('change'));
    await harness.fixture.whenStable();
    expect(input.value).toBe('1');
    expect(cart.itemCount()).toBe(1);
  });

  it('updates counts and removes items using semantic buttons, without changing checkout payload shape', async () => {
    const cart = TestBed.inject(CartService);
    cart.add(product);
    const harness = await RouterTestingHarness.create('/cart');
    const increase = harness.routeNativeElement?.querySelector(
      '[aria-label="Increase quantity for Cotton shirt"]',
    ) as HTMLButtonElement;
    increase.click();
    await harness.fixture.whenStable();
    expect(cart.toCheckoutPayload()).toEqual([{ productId: 'men:shirt-1', quantity: 2 }]);
    expect(harness.routeNativeElement?.querySelector('.line-total')?.textContent).toContain(
      '20.20',
    );
    expect(harness.routeNativeElement?.textContent).toContain(
      'Estimated total before shipping and tax',
    );
    const remove = harness.routeNativeElement?.querySelector(
      '[aria-label="Remove Cotton shirt"]',
    ) as HTMLButtonElement;
    remove.click();
    await harness.fixture.whenStable();
    expect(cart.lineCount()).toBe(0);
    expect(harness.routeNativeElement?.textContent).toContain('Your cart is empty');
  });

  it('shows storage failure feedback without losing optimistic cart changes', async () => {
    const persistence = TestBed.inject(CartPersistence);
    vi.spyOn(persistence, 'write').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const cart = TestBed.inject(CartService);
    cart.add(product);
    const harness = await RouterTestingHarness.create('/cart');
    await harness.fixture.whenStable();
    expect(cart.itemCount()).toBe(1);
    expect(harness.routeNativeElement?.querySelector('.storage-warning')?.textContent).toContain(
      'cannot be saved',
    );
  });
});
