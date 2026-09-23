import { ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import type { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { ApplicationErrorHandler } from './core/errors/application-error-handler';
import { routes } from './app.routes';
import { cartProviders } from './features/cart/cart.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    ...cartProviders,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    { provide: ErrorHandler, useClass: ApplicationErrorHandler },
  ],
};
