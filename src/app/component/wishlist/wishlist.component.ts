import { Component, OnInit } from '@angular/core';
import {GoodsService} from "../../services/goods.service";
import {CartService} from "../../services/cart.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Good} from "../../interface/good";
import {WishlistService} from "../../services/wishlist.service";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  cart: Good[] = []

  constructor(private cs: CartService,
              private as: AuthService,
              private gs: GoodsService,
              private router: Router,
              private wl: WishlistService) { }

  ngOnInit(): void {
    this.wl.getWishlist().subscribe(cart => {
      this.cart = cart.map(shopping =>{
        return {
          id: shopping.payload.doc.id,
          ...shopping.payload.doc.data() as GoodsService
        }
      })
    })
  }


  delete(index) {
    return this.wl.delete(this.cart[index].id)
    console.log(this.cart[index].id,'ss')

  }

  update(index) {
    return this.cs.update(this.cart[index].id, this.cart[index].amount)
    console.log(this.cart[index].id)
  }


  myproduct: any
  setData(product) {
    this.myproduct = product
    this.gs.setData(this.myproduct);
    this.router.navigate(['good'])
  }

    addCart(cart){
    console.log(cart,)
    let cartData = {
      // DataId: cart.id,
      name: cart.name,
      photoUrl: cart.photoUrl,
      amount: 1,
      price: cart.price,
      // description: cart.discription,
    }
    this.cs.addToCart(cartData).then(res => { console.log(res)})
  }

}
