import { Component, OnInit } from '@angular/core';
import {GoodsService} from '../../services/goods.service';
import {Good} from '../../interface/good';
import {element} from 'protractor';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  goods : Good[] = []
  add: number = -1
  responsiveOptions;


  constructor(private gs: GoodsService,
              private cs: CartService,
              private as: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    // this.gs.mainslider().subscribe(
    //   data => {
    //    this.goods= data.map(element=> {
    //       return{
    //         id: element.payload.doc.id,
    //         ...element.payload.doc.data() as Good
    //       }
    //     })
    //   })
    }

  addToCart(index: number) {
    if (this.as.userId) {
      this.add = +index;
    } else {
      this.router.navigate(['/login']);
    }
  }


  buy(amount: number){
  let selectedGood =this.goods[this.add]
    let data = {
      // id: selectedGood.id,
      name: selectedGood.name,
      photoUrl: selectedGood.photoUrl,
      amount: +amount,
      price: selectedGood.price
    }
    this.cs.addToCart(data).then(()=> this.add = -1 )
  }

  // boxes: Array<number> = new Array(5);

}
