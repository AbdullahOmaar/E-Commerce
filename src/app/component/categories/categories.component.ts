import { Component, OnInit } from '@angular/core';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  goods : Good[] = []

  constructor(private gs: GoodsService,) { }

  ngOnInit(): void {
    this.gs.gitAllGoods().subscribe(
      data => {
        this.goods= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
      })
  }

}
