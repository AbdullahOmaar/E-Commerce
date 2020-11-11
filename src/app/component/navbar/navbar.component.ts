import { Component, OnInit,HostListener, Input, ViewChild } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
import {GoodsService} from "../../services/goods.service";
import {WishlistService} from "../../services/wishlist.service";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];

  isUser: boolean = false


  checked1?: boolean = true;

  public screenWidth: any;

  public screenHeight: any;

  screenMop : boolean = false;

  showMainMenu : boolean = false;

  wishlist : any

  cart : any
  constructor(private as: AuthService,
              private wl: WishlistService,
              private cs: CartService,
              private router: Router,
              private gs: GoodsService) { }


  ngOnInit() : void{
    this.as.user.subscribe(user => {
        if (user) {
          this.isUser = true
          this.as.userId = user.uid
          localStorage.setItem('user' , JSON.stringify(this.as.userId))
        } else {
          this.isUser = false
          this.as.userId = ''
          localStorage.removeItem('user')

        }
      }
    )
    //getWishlist
    this.wl.getWishlist().subscribe(cart => {
      this.wishlist = cart.map(shopping =>{
        return {
          id: shopping.payload.doc.id,
          ...shopping.payload.doc.data() as GoodsService
        }
      })
    })
  //Cart
    this.cs.getCart().subscribe(cart => {
      this.cart = cart.map(shopping =>{
        return {
          id: shopping.payload.doc.id,
          ...shopping.payload.doc.data() as GoodsService
        }
      })
    })

    // this.screenWidth = window.innerWidth;
    //
    // this.screenHeight = window.innerHeight;
    //
    this.showMainMenu = false

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
    this.as.logout().then( res => console.log('logout'))
  }


  mainMenu(){
    if(this.showMainMenu == false){
      this.showMainMenu = true

    }else {
      this.showMainMenu = false

    }
  }

  categories :any
  selectCategory(good){
    console.log(good.name)
    this.categories = good
    this.gs.setselectCategory(this.categories);
    console.log(this.categories)
    this.router.navigate(['shop'])
  }

}

