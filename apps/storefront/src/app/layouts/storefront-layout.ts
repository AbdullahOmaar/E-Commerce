import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import type { ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { FeedbackStore } from '../core/errors/feedback.store';

@Component({
  selector: 'app-storefront-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './storefront-layout.html',
  styleUrl: './storefront-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorefrontLayout {
  protected readonly feedback = inject(FeedbackStore);
  private readonly main = viewChild<ElementRef<HTMLElement>>('main');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focusContent());
  }

  protected focusContent(event?: Event): void {
    event?.preventDefault();
    this.main()?.nativeElement.focus({ preventScroll: true });
  }

  protected dismissError(): void {
    this.feedback.dismiss();
    this.focusContent();
  }
}
