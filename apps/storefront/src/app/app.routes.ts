import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/storefront-layout').then((module) => module.StorefrontLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'shop' },
      { path: 'home', pathMatch: 'full', redirectTo: 'shop' },
      {
        path: 'shop',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then((module) => module.catalogRoutes),
      },
      {
        path: '**',
        title: 'Page not found | E-Commerce',
        loadComponent: () =>
          import('./shared/components/not-found.page').then((module) => module.NotFoundPage),
      },
    ],
  },
];
