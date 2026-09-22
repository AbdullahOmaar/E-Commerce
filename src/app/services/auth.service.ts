import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  readonly user: Observable<firebase.User | null>;
  readonly userId$: Observable<string>;
  readonly isAdmin$: Observable<boolean>;
  private currentUserId = '';
  private readonly identitySubscription: Subscription;

  get userId(): string { return this.currentUserId; }

  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.user.pipe(shareReplay({ bufferSize: 1, refCount: true }));
    this.userId$ = this.user.pipe(map(user => user ? user.uid : ''), distinctUntilChanged());
    this.isAdmin$ = afAuth.idTokenResult.pipe(
      map(token => !!token && token.claims.admin === true),
      distinctUntilChanged()
    );
    this.identitySubscription = this.userId$.subscribe(uid => this.currentUserId = uid);
  }

  async requireUserId(): Promise<string> {
    const uid = await this.userId$.pipe(take(1)).toPromise();
    if (!uid) { throw new Error('Sign in to manage your cart or wishlist.'); }
    return uid;
  }

  signup(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> { return this.afAuth.auth.signOut(); }
  ngOnDestroy(): void { this.identitySubscription.unsubscribe(); }
}
