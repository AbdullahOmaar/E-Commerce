import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="not-found-heading">
      <p>404</p>
      <h1 id="not-found-heading">Page not found</h1>
      <p>The page you’re looking for is unavailable.</p>
      <a routerLink="/shop">Return to the store</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
