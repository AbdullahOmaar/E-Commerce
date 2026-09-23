import { FeedbackService } from '../../core/errors/feedback.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import {Component, Input, OnInit} from '@angular/core';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';
import {Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {WishlistService} from '../../services/wishlist.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  constructor(private feedback: FeedbackService, private gs: GoodsService,
              private cs: CartService,
              private as: AuthService,
              private router: Router,
              private wl: WishlistService) { }
  private readonly destroyed$ = new Subject<void>();

  goods: Good[] = [];
  products: Good[] = [];

  myproduct: Good;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.gs.mainslider().pipe(takeUntil(this.destroyed$)).subscribe(
      data => {
        this.goods = data;
      }, () => this.feedback.error('Unable to load data. Please reload and try again.'));

    this.gs.gitAllGoods().pipe(takeUntil(this.destroyed$)).subscribe(
      data => {
        this.products = data;
      }, () => this.feedback.error('Unable to load data. Please reload and try again.'));
  }

  setData(product: Good) {
    this.myproduct = product;
    this.gs.setData(this.myproduct);
    this.router.navigate(['good']);
  }


  addCart(cart: Good){

    const cartData = {
      DataId: cart.id,
      name: cart.name || 'Product',
      photoUrl: cart.photoUrl || '',
      amount: 1,
      price: cart.price,
      description: cart.description || '',
    };
    this.cs.addToCart(cartData).then(() => this.feedback.success('Item saved.')).catch(() => this.feedback.error('Unable to save. Sign in and try again.'));
  }

  addWishlist(cart: Good){

    const wishlistData = {
      DataId: cart.id,
      name: cart.name || 'Product',
      photoUrl: cart.photoUrl || '',
      price: cart.price,
      description: cart.description || '',
    };
    this.wl.addToWishlist(wishlistData).then(() => this.feedback.success('Item saved.')).catch(() => this.feedback.error('Unable to save. Sign in and try again.'));
  }
}
