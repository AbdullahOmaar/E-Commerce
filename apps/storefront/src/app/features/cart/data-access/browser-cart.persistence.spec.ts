import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserCartPersistence, CART_STORAGE_KEY } from './browser-cart.persistence';

describe('browser cart persistence boundary', () => {
  it('never touches the document or localStorage on the server', () => {
    TestBed.configureTestingModule({
      providers: [
        BrowserCartPersistence,
        { provide: PLATFORM_ID, useValue: 'server' },
        {
          provide: DOCUMENT,
          useFactory: () => {
            throw new Error('Browser document accessed on server');
          },
        },
      ],
    });
    const persistence = TestBed.inject(BrowserCartPersistence);
    expect(persistence.available).toBe(false);
    expect(persistence.read()).toBeNull();
    expect(() => persistence.write('data')).not.toThrow();
  });

  it('handles browsers that throw when localStorage is accessed', () => {
    const view = {
      get localStorage(): Storage {
        throw new Error('SecurityError');
      },
    };
    TestBed.configureTestingModule({
      providers: [
        BrowserCartPersistence,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: { defaultView: view } },
      ],
    });
    expect(TestBed.inject(BrowserCartPersistence).available).toBe(false);
  });

  it('uses only the new namespaced cart key and preserves legacy storage', () => {
    const storage = { getItem: vi.fn(() => 'saved'), setItem: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        BrowserCartPersistence,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: { defaultView: { localStorage: storage } } },
      ],
    });
    const persistence = TestBed.inject(BrowserCartPersistence);
    expect(persistence.read()).toBe('saved');
    persistence.write('new cart');
    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith(CART_STORAGE_KEY);
    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith(CART_STORAGE_KEY, 'new cart');
  });
});
