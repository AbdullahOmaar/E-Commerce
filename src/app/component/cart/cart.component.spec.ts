import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { configureComponentTest } from '../../testing/component-test';
import { CartService } from '../../services/cart.service';
import { CartComponent } from './cart.component';

describe('CartComponent interactions', () => {
  let fixture: ComponentFixture<CartComponent>;
  let update: jasmine.Spy;
  beforeEach(async () => {
    await configureComponentTest();
    update = jasmine.createSpy('update').and.returnValue(Promise.resolve());
    TestBed.overrideProvider(CartService, { useValue: {
      getCart: () => of([{ id: 'line', DataId: 'sku', name: 'Product', price: 12.5, amount: 2 }]),
      update, delete: () => Promise.resolve()
    } });
    fixture = TestBed.createComponent(CartComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });
  it('renders quantity-based estimates and persists a real input change', async () => {
    expect(fixture.nativeElement.textContent).toContain('$25.00');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type=number]');
    input.value = '3';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(update).toHaveBeenCalledWith('line', 3);
    expect(fixture.nativeElement.textContent).toContain('$67.50');
  });
  it('restores the previous quantity and announces a failed write', async () => {
    update.and.callFake(() => Promise.reject(new Error('offline')));
    await fixture.componentInstance.update(0, 4);
    fixture.detectChanges();
    expect(fixture.componentInstance.cart[0].amount).toBe(2);
    expect(fixture.nativeElement.querySelector('[role=alert]').textContent).toContain('not saved');
  });
});
