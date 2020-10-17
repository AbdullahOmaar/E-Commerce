import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';


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



  constructor(private gs: GoodsService, private primengConfig: PrimeNGConfig, private Goods: GoodsService) { }

  ngOnInit() {
    this.gs.gitAllGoods().subscribe(
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

}
