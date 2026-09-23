import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import type { ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../domain/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  protected readonly cart = inject(CartService);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  protected setQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cart.setQuantity(productId, input.valueAsNumber);
    // Also normalize the input when a clamped quantity leaves the Signal unchanged.
    input.value = String(
      this.cart.lines().find((line) => line.productId === productId)?.quantity ?? 1,
    );
  }

  protected remove(productId: string): void {
    this.cart.remove(productId);
    this.heading()?.nativeElement.focus({ preventScroll: true });
  }

  protected clear(): void {
    this.cart.clear();
    this.heading()?.nativeElement.focus({ preventScroll: true });
  }
}
