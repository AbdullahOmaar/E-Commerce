import { Good } from '../../interface/good';
import { FeedbackService } from '../../core/errors/feedback.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, OnInit, HostListener, Input, ViewChild } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {GoodsService} from '../../services/goods.service';
import {WishlistService} from '../../services/wishlist.service';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(private as: AuthService,
              private wl: WishlistService,
              private cs: CartService,
              private router: Router,
              private gs: GoodsService,
              private feedback: FeedbackService) { }
  private readonly destroyed$ = new Subject<void>();


  items: MenuItem[];

  isUser = false;


  checked1 = true;

  public screenWidth: number;

  public screenHeight: number;

  screenMop = false;

  showMainMenu = false;

  wishlist: Good[] = [];

  cart: Good[] = [];

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  ngOnInit(): void{
    this.as.user.pipe(takeUntil(this.destroyed$)).subscribe(user => this.isUser = !!user);
    // getWishlist
    this.wl.getWishlist().pipe(takeUntil(this.destroyed$)).subscribe(cart => {
      this.wishlist = cart;
    }, () => this.feedback.error('Unable to load your wishlist.'));
  // Cart
    this.cs.getCart().pipe(takeUntil(this.destroyed$)).subscribe(cart => {
      this.cart = cart;
    }, () => this.feedback.error('Unable to load your cart.'));

    // this.screenWidth = window.innerWidth;
    //
    // this.screenHeight = window.innerHeight;
    //
    this.showMainMenu = false;

  }

  // @HostListener('window:resize', ['$event'])
  //
  // onResize(event) {
  //   this.screenWidth = window.innerWidth;
  //   if (this.screenWidth <= 360){
  //     this.screenMop = true
  //     this.showMainMenu = false
  //   }else {
  //     this.screenMop = false
  //     this.showMainMenu = true
  //   }
  // }

  logout(){
    this.as.logout().then(() => this.router.navigate(['/login'])).catch(() => this.feedback.error('Unable to sign out. Try again.'));
  }


  mainMenu(){
    if (!this.showMainMenu){
      this.showMainMenu = true;

    }else {
      this.showMainMenu = false;

    }
  }


  // coll categories

  selectCategory(categoriesName){
    this.gs.setselectCategory(categoriesName);
    this.router.navigate(['/shop']);
  }

}
