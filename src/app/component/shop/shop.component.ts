import { FeedbackService } from '../../core/errors/feedback.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {MenuItem, SelectItem} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {WishlistService} from '../../services/wishlist.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {




  constructor(private feedback: FeedbackService, private gs: GoodsService,
              private primengConfig: PrimeNGConfig,
              private Goods: GoodsService,
              private cs: CartService,
              private router: Router,
              private wl: WishlistService) { }
  private readonly destroyed$ = new Subject<void>();


  products: Good[];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  totalRecords: number;

  myproduct: Good;

  items: MenuItem[];

  val1: number;

  rangeValues: number[] = [0, 1000];

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    // this.products = []
    this.gs.gitSelectedCategory().pipe(takeUntil(this.destroyed$)).subscribe(
      data => {
        this.products = data;
      }, () => this.feedback.error('Unable to load data. Please reload and try again.'));

    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
    ];

    this.primengConfig.ripple = true;

  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }

  }

  addCart(cart: Good){
    const cartData = {
      DataId: cart.id,
      name: cart.name || 'Product',
      photoUrl: cart.photoUrl || '',
      amount: 1,
      price: cart.price
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

  setData(product: Good) {
    this.myproduct = product;
    this.gs.setData(this.myproduct);
    this.router.navigate(['good']);
  }

  selectCategory(categoriesName: string): void {
    this.gs.setselectCategory(categoriesName);
  }
}
