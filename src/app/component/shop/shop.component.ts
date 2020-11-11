import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";
import {WishlistService} from "../../services/wishlist.service";


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  products: Good[];

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;

  totalRecords: number;

  myproduct: any



  constructor(private gs: GoodsService,
              private primengConfig: PrimeNGConfig,
              private Goods: GoodsService,
              private cs: CartService,
              private router: Router,
              private wl: WishlistService) { }

  ngOnInit() {
    this.gs.gitSelectedCategory().subscribe(
      data => {
        this.products= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
      })

    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
    ];

    this.primengConfig.ripple = true;

  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }

  }

  addCart(cart){
    console.log(cart,'ssssssssssssssssss')
    let cartData = {
      DataId: cart.id,
      name: cart.name,
      photoUrl: cart.photoUrl,
      amount: 1,
      price: cart.price
    }
    this.cs.addToCart(cartData).then(res => { console.log(res)})
    console.log('sssssssssss')
  }

  addWishlist(cart){
    console.log(cart,)
    let wishlistData = {
      DataId: cart.id,
      name: cart.name,
      photoUrl: cart.photoUrl,
      price: cart.price,
      description: cart.description,
    }
    this.wl.addToWishlist(wishlistData).then(res => { console.log(res)})
  }

  setData(product) {
    this.myproduct = product
    this.gs.setData(this.myproduct);
    this.router.navigate(['good'])
  }
}
