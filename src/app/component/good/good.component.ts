import { Component, OnInit } from '@angular/core';
import {GoodsService} from "../../services/goods.service";
import {Router} from "@angular/router";
import {Country, Good} from "../../interface/good";

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrls: ['./good.component.scss']
})
export class GoodComponent implements OnInit {

  good: Good
  id?: string
  name?: string
  price?: number
  discription?: string
  photoUrl?: string
  amount?: number
  code?:string;
  description?:string;
  quantity?:number;
  inventoryStatus?:string;
  category?:string;
  image?:string;
  rating?:number;
  country?: Country;
  company?: string;
  date?: Date;
  status?: string;
  discount?: number;
  //
  val2: number = 3;

  constructor(private gs: GoodsService,
              private router: Router) { }

  ngOnInit(): void {
    this.good = this.gs.getData()
    if (!this.gs.getData()){
      this.router.navigate(['/'])
    }
    this.name = this.good.name
    this.status = this.good.status
    this.discount = this.good.discount
    this.photoUrl = this.good.photoUrl
    this.discription = this.good.discription
    this.category = this.good.category
    this.price = this.good.price

  }


}
