import type { Routes } from '@angular/router';

export const cartRoutes: Routes = [
  {
    path: '',
    title: 'Your cart | E-Commerce',
    loadComponent: () => import('./ui/cart.page').then((module) => module.CartPage),
  },
];
