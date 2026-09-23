import type { Provider } from '@angular/core';
import { BrowserCartPersistence } from './data-access/browser-cart.persistence';
import { CartPersistence } from './domain/cart.persistence';

export const cartProviders: Provider[] = [
  { provide: CartPersistence, useClass: BrowserCartPersistence },
];
