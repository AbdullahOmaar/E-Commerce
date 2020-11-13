import { Component, OnInit } from '@angular/core';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';
import {CategoryService} from '../../services/category.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  goods : Good[] = []

  constructor(private gs: GoodsService,
              private cs: CategoryService,
              private router: Router,) { }

  ngOnInit(): void {
    this.cs.gitAllCategory().subscribe(
      data => {
        this.goods= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
      })
  }

    categories :any
    selectCategory(good){
      this.categories = good.name
      this.gs.setselectCategory(this.categories);
      this.router.navigate(['shop'])
      }

}
