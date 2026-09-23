import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppModule } from '../app.module';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { GoodsService } from '../services/goods.service';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';

/** Real templates/modules with offline service boundaries; never touches Firebase. */
export function configureComponentTest(): Promise<void> {
  return TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule],
    providers: [
      { provide: ErrorHandler, useValue: { handleError: (error: unknown) => { throw error; } } },
      { provide: AuthService, useValue: { user: of(null), userId$: of(''), isAdmin$: of(false), userId: '',
        login: () => Promise.resolve(), logout: () => Promise.resolve() } },
      { provide: CartService, useValue: { getCart: () => of([]), update: () => Promise.resolve(),
        delete: () => Promise.resolve(), addToCart: () => Promise.resolve() } },
      { provide: WishlistService, useValue: { getWishlist: () => of([]), delete: () => Promise.resolve(),
        addToWishlist: () => Promise.resolve() } },
      { provide: GoodsService, useValue: { gitAllGoods: () => of([]), gitSelectedCategory: () => of([]),
        gitCategory: () => of([]), mainslider: () => of([]), getData: () => ({ name: 'Product', price: 10 }),
        setData: () => {}, setselectCategory: () => {} } },
      { provide: CategoryService, useValue: { gitAllCategory: () => of([]) } },
      { provide: UserService, useValue: { addNewUser: () => Promise.resolve() } }
    ]
  }).compileComponents();
}
