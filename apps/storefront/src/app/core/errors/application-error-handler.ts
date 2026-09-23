import { ErrorHandler, inject, Injectable } from '@angular/core';
import { FeedbackStore } from './feedback.store';

@Injectable()
export class ApplicationErrorHandler implements ErrorHandler {
  private readonly feedback = inject(FeedbackStore);
  private readonly diagnostics = new ErrorHandler();

  handleError(error: unknown): void {
    this.feedback.showUnexpectedError();
    // Keep Angular's diagnostic reporting in addition to visible, sanitized feedback.
    this.diagnostics.handleError(error);
  }
}
