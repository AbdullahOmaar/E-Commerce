import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { configureComponentTest } from './testing/component-test';
import { AuthService } from './services/auth.service';
import { NotFoundComponent } from './component/not-found/not-found.component';

describe('Routes and access control', () => {
  let uid: BehaviorSubject<string>;
  let admin: BehaviorSubject<boolean>;
  let router: Router;
  let navigate: (url: string) => Promise<boolean>;
  beforeEach(async () => {
    await configureComponentTest();
    uid = new BehaviorSubject('');
    admin = new BehaviorSubject(false);
    TestBed.overrideProvider(AuthService, { useValue: { userId$: uid, isAdmin$: admin, user: of(null) } });
    router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    navigate = url => TestBed.inject(NgZone).run(() => router.navigateByUrl(url));
  });
  it('keeps all public routes and the home alias reachable', async () => {
    for (const path of ['/', '/login', '/signup', '/shop', '/filter', '/good']) {
      expect(await navigate(path)).toBe(true);
      expect(router.url).toBe(path);
    }
    await navigate('/home');
    expect(router.url).toBe('/');
    await navigate('/missing');
    expect(router.routerState.snapshot.root.firstChild.component).toBe(NotFoundComponent);
  });
  it('redirects signed-out users and preserves the requested destination', async () => {
    for (const path of ['/cart', '/wishlist', '/admin']) {
      await navigate(path);
      expect(router.url).toBe('/login?returnUrl=' + encodeURIComponent(path));
    }
  });
  it('allows an authenticated cart and wishlist, and requires an administrator claim for admin', async () => {
    uid.next('alice');
    await navigate('/cart');
    expect(router.url).toBe('/cart');
    await navigate('/wishlist');
    expect(router.url).toBe('/wishlist');
    await navigate('/admin');
    expect(router.url).toBe('/');
    admin.next(true);
    await navigate('/admin');
    expect(router.url).toBe('/admin');
  });
});
