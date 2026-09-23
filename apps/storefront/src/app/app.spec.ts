import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { ApplicationErrorHandler } from './core/errors/application-error-handler';
import { routes } from './app.routes';
import { CartPersistence } from './features/cart/domain/cart.persistence';

describe('standalone storefront navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CartPersistence,
          useValue: { available: false, read: () => null, write: () => undefined },
        },
        provideRouter(routes),
        { provide: ErrorHandler, useClass: ApplicationErrorHandler },
      ],
    });
  });

  it('loads the lazy shop from the root URL and updates the page title', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(TestBed.inject(Router).url).toBe('/shop');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Something good',
    );
    expect(TestBed.inject(Title).getTitle()).toBe('Shop | E-Commerce');
    expect(harness.routeNativeElement?.querySelector('nav a')?.getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('preserves the historical /home entry point', async () => {
    const harness = await RouterTestingHarness.create('/home');
    expect(TestBed.inject(Router).url).toBe('/shop');
    expect(harness.routeNativeElement?.textContent).toContain('not yet available in this preview');
  });

  it('renders unknown paths and returns to the lazy shop without reloading', async () => {
    const harness = await RouterTestingHarness.create('/missing');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Page not found');
    const back = harness.routeNativeElement?.querySelector('main a') as HTMLAnchorElement;
    back.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/shop');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain(
      'Something good',
    );
  });

  it('supports skipping the navigation with a keyboard-usable link', async () => {
    const harness = await RouterTestingHarness.create('/shop');
    const main = harness.routeNativeElement?.querySelector('main');
    const focus = vi.spyOn(main as HTMLElement, 'focus');
    const skip = harness.routeNativeElement?.querySelector('.skip-link') as HTMLAnchorElement;
    skip.click();
    expect(focus).toHaveBeenCalledOnce();
  });

  it('shows sanitized global error feedback and allows dismissal', async () => {
    const diagnostics = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const harness = await RouterTestingHarness.create('/shop');
      TestBed.inject(ErrorHandler).handleError(new Error('Internal database path and token'));
      await harness.fixture.whenStable();
      harness.detectChanges();
      const alert = harness.routeNativeElement?.querySelector('[role="alert"]');
      expect(alert?.textContent).toContain('Please reload');
      expect(alert?.textContent).not.toContain('Internal database path and token');
      (alert?.querySelector('button') as HTMLButtonElement).click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(harness.routeNativeElement?.querySelector('[role="alert"]')).toBeNull();
      expect(diagnostics).toHaveBeenCalled();
    } finally {
      diagnostics.mockRestore();
    }
  });
});
