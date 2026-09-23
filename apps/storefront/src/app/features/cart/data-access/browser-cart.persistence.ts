import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CartPersistence } from '../domain/cart.persistence';

export const CART_STORAGE_KEY = 'ecommerce.storefront.cart.v1';

@Injectable()
export class BrowserCartPersistence extends CartPersistence {
  private readonly storage = this.browserStorage();
  readonly available = this.storage !== null;

  read(): string | null {
    return this.storage?.getItem(CART_STORAGE_KEY) ?? null;
  }

  write(value: string): void {
    this.storage?.setItem(CART_STORAGE_KEY, value);
  }

  private browserStorage(): Storage | null {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return null;
    try {
      return inject(DOCUMENT).defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
