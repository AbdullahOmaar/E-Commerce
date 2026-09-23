import { FeedbackService } from '../../core/errors/feedback.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';
import {CategoryService} from '../../services/category.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {

  constructor(private feedback: FeedbackService, private gs: GoodsService,
              private cs: CategoryService,
              private router: Router, ) { }
  private readonly destroyed$ = new Subject<void>();


  goods: Good[] = [];

    categories: string;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.cs.gitAllCategory().pipe(takeUntil(this.destroyed$)).subscribe(
      data => {
        this.goods = data;
      }, () => this.feedback.error('Unable to load data. Please reload and try again.'));
  }
    selectCategory(good){
      this.categories = good.name;
      this.gs.setselectCategory(this.categories);
      this.router.navigate(['shop']);
      }

}
