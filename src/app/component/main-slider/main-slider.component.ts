import { Component, OnInit } from '@angular/core';
import {Good} from "../../interface/good";
import {GoodsService} from "../../services/goods.service";

@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.scss']
})
export class MainSliderComponent implements OnInit {

  goods : Good[] = []
  responsiveOptions;

  constructor(private gs: GoodsService,) { }

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
  }

}
