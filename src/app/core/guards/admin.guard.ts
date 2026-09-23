import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

/** Navigation only. Firebase rules must enforce the same claim on the server. */
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isAdmin$.pipe(take(1),
      map(admin => admin ? true : this.router.createUrlTree(['/'])),
      catchError(() => of(this.router.createUrlTree(['/']))));
  }
}
