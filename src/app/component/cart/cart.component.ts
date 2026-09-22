import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Good } from '../../interface/good';
import { CartService } from '../../services/cart.service';
import { GoodsService } from '../../services/goods.service';
import { cartEstimates, clampQuantity } from '../../features/cart/domain/cart-estimates';

@Component({ selector: 'app-cart', templateUrl: './cart.component.html', styleUrls: ['./cart.component.scss'] })
export class CartComponent implements OnInit, OnDestroy {
  cart: Good[] = [];
  loading = true;
  error = '';
  readonly pending = new Set<string>();
  private readonly destroyed$ = new Subject<void>();

  get estimates(): ReturnType<typeof cartEstimates> { return cartEstimates(this.cart); }

  constructor(private cs: CartService, private gs: GoodsService, private router: Router) {}
  ngOnInit(): void {
    this.cs.getCart().pipe(takeUntil(this.destroyed$)).subscribe({
      next: cart => { this.cart = cart; this.loading = false; },
      error: () => { this.loading = false; this.error = 'Unable to load your cart. Please reload and try again.'; }
    });
  }
  async delete(index: number): Promise<void> {
    const line = this.cart[index];
    if (!line || this.pending.has(line.id)) { return; }
    this.error = '';
    this.pending.add(line.id);
    try { await this.cs.delete(line.id); } catch { this.error = 'Unable to remove this item. Please try again.'; }
    finally { this.pending.delete(line.id); }
  }
  async update(index: number, value: number): Promise<void> {
    const line = this.cart[index];
    if (!line || this.pending.has(line.id)) { return; }
    this.error = '';
    this.pending.add(line.id);
    const updated = { ...line, amount: clampQuantity(value) };
    this.cart = this.cart.map(item => item === line ? updated : item);
    try { await this.cs.update(line.id, updated.amount); }
    catch {
      this.cart = this.cart.map(item => item === updated ? line : item);
      this.error = 'Quantity was not saved. Please try again.';
    } finally { this.pending.delete(line.id); }
  }
  setData(product: Good): void { this.gs.setData(product); this.router.navigate(['/good']); }
  trackItem(index: number, product: Good): string { return product.id; }
  ngOnDestroy(): void { this.destroyed$.next(); this.destroyed$.complete(); }
}
