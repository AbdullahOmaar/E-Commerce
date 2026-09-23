import { FeedbackService } from '../../core/errors/feedback.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Good} from '../../interface/good';
import {GoodsService} from '../../services/goods.service';

@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.scss']
})
export class MainSliderComponent implements OnInit, OnDestroy {

  constructor(private feedback: FeedbackService, private gs: GoodsService, ) { }
  private readonly destroyed$ = new Subject<void>();


  goods: Good[] = [];
  responsiveOptions;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.gs.mainslider().pipe(takeUntil(this.destroyed$)).subscribe(
      data => {
        this.goods = data;
      }, () => this.feedback.error('Unable to load data. Please reload and try again.'));
  }

}
