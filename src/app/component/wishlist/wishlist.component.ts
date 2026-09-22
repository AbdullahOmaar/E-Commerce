import { FeedbackService } from '../../core/errors/feedback.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {GoodsService} from '../../services/goods.service';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Good} from '../../interface/good';
import {WishlistService} from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {

  constructor(private feedback: FeedbackService, private cs: CartService,
              private as: AuthService,
              private gs: GoodsService,
              private router: Router,
              private wl: WishlistService) { }
  private readonly destroyed$ = new Subject<void>();


  cart: Good[] = [];

  myproduct: Good;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.wl.getWishlist().pipe(takeUntil(this.destroyed$)).subscribe(cart => {
      this.cart = cart;
    }, () => this.feedback.error('Unable to load your wishlist.'));
  }


  delete(index) {
    return this.wl.delete(this.cart[index].id).catch(() => this.feedback.error('Unable to remove this item.'));


  }
  setData(product: Good) {
    this.myproduct = product;
    this.gs.setData(this.myproduct);
    this.router.navigate(['good']);
  }

    addCart(cart: Good){

    const cartData = {
      DataId: cart.DataId || '',
      name: cart.name || 'Product',
      photoUrl: cart.photoUrl || '',
      amount: 1,
      price: cart.price,
      description: cart.description || '',
    };
    this.cs.addToCart(cartData).then(() => this.feedback.success('Item saved.')).catch(() => this.feedback.error('Unable to save. Sign in and try again.'));
  }

}
