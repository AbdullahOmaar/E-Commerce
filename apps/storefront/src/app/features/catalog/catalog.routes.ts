import type { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  {
    path: '',
    title: 'Shop | E-Commerce',
    loadComponent: () =>
      import('./ui/catalog-preview.page').then((module) => module.CatalogPreviewPage),
  },
];
