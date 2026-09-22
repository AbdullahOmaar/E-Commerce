import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private messages: MessageService) {}
  success(detail: string): void { this.messages.add({ severity: 'success', summary: 'Done', detail }); }
  error(detail = 'The request failed. Please try again.'): void {
    this.messages.add({ severity: 'error', summary: 'Unable to complete request', detail, life: 7000 });
  }
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private feedback: FeedbackService) {}
  handleError(error: unknown): void {
    // Do not display raw errors, user records, tokens or provider messages.
    this.feedback.error('Something went wrong. Reload the page and try again.');
  }
}
