import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((error: unknown) => {
  const root = document.querySelector('app-root');
  if (root) {
    root.setAttribute('role', 'alert');
    root.textContent = 'The store could not start. Please reload the page and try again.';
  }
  console.error('Storefront bootstrap failed.', error);
});
