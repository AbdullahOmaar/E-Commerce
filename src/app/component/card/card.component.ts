import {Component, Input, OnInit} from '@angular/core';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {AuthService} from "../../services/auth.service";
import {WishlistService} from "../../services/wishlist.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  goods : Good[] = []
  products : Good[] = []
  constructor(private gs: GoodsService,
              private cs: CartService,
              private as: AuthService,
              private router: Router,
              private wl: WishlistService) { }

  myproduct: any

  ngOnInit(): void {
    this.gs.mainslider().subscribe(
      data => {
        this.goods= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
      })

    this.gs.gitAllGoods().subscribe(
      data => {
        this.products= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
      })
  }

  setData(product) {
    this.myproduct = product
    this.gs.setData(this.myproduct);
    this.router.navigate(['good'])
  }


  addCart(cart){
    console.log(cart,)
    let cartData = {
      DataId: cart.id,
      name: cart.name,
      photoUrl: cart.photoUrl,
      amount: 1,
      price: cart.price,
      description: cart.discription,
    }
    this.cs.addToCart(cartData).then(res => { console.log(res)})
  }

  addWishlist(cart){
    console.log(cart,)
    let wishlistData = {
      DataId: cart.id,
      name: cart.name,
      photoUrl: cart.photoUrl,
      price: cart.price,
      description: cart.discription,
    }
    this.wl.addToWishlist(wishlistData).then(res => { console.log(res)})
  }
}
