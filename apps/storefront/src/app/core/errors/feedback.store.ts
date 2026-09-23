import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FeedbackStore {
  private readonly errorState = signal<string | null>(null);
  readonly error = this.errorState.asReadonly();

  showUnexpectedError(): void {
    this.errorState.set('Something went wrong. Please reload the page and try again.');
  }

  dismiss(): void {
    this.errorState.set(null);
  }
}
