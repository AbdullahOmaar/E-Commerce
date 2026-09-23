import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalog-preview',
  template: `
    <section aria-labelledby="catalog-heading">
      <p class="eyebrow">A new shopping experience</p>
      <h1 id="catalog-heading">Something good<br />is on the way.</h1>
      <p class="intro">
        We’re preparing the new store. Product browsing and purchases are not yet available in this
        preview.
      </p>
      <div class="empty-state">
        <h2>The collection is coming soon</h2>
        <p>Check back as the store takes shape.</p>
      </div>
    </section>
  `,
  styles: `
    .eyebrow {
      color: var(--accent);
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1 {
      font-size: clamp(2.4rem, 6vw, 4.5rem);
      line-height: 1.05;
      letter-spacing: -0.05em;
      margin: 1rem 0 1.5rem;
    }
    .intro {
      max-width: 40rem;
      font-size: 1.15rem;
      line-height: 1.7;
      color: var(--muted);
    }
    .empty-state {
      margin-top: 3rem;
      padding: 2rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.6rem;
    }
    h2 {
      margin-top: 0;
      font-size: 1.25rem;
    }
    .empty-state p {
      color: var(--muted);
      margin-bottom: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPreviewPage {}
