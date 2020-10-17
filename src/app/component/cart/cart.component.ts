import { Component, OnInit } from '@angular/core';
import {Good} from '../../interface/good';
import {CartService} from '../../services/cart.service';
import {GoodsService} from '../../services/goods.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart: Good[] = []

  constructor(private cs: CartService,
               private as: AuthService) { }

  ngOnInit(): void {
    this.as.user.subscribe(user => {
      if (user){
        this.as.userId= user.uid
      }
      // this.as.userId= ''
    })

    this.cs.getCart().subscribe(cart => {
      this.cart = cart.map(shopping =>{
        return {
          id: shopping.payload.doc.id,
          ...shopping.payload.doc.data() as GoodsService
        }
      })
    })
  }


  delete(index){
    return this.cs.delete(this.cart[index].id)
  }

  update(index){
    return this.cs.update(this.cart[index].id , this.cart[index].amount)
  }
}



