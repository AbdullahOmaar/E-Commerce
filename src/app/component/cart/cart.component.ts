import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Good} from '../../interface/good';
import {CartService} from '../../services/cart.service';
import {GoodsService} from '../../services/goods.service';
import {AuthService} from '../../services/auth.service';
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],

})
export class CartComponent implements OnInit {

  cart: Good[] = []

  lengthItem : number

  Subtotal: any

  Shipping: number = 30


  constructor(private cs: CartService,
              private as: AuthService,
              private gs: GoodsService,
              private router: Router) {
  }


ngOnInit(): void {

    this.cs.getCart().subscribe(cart => {
      this.cart = cart.map(shopping =>{
        return {
          id: shopping.payload.doc.id,
          ...shopping.payload.doc.data() as GoodsService
        }
      })
    })
  }





  delete(index) {
    return this.cs.delete(this.cart[index].id)
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
    console.log(this.myproduct )
    this.router.navigate(['good'])
  }
}




