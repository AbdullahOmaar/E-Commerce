import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService identity regression', () => {
  let state: BehaviorSubject<firebase.User>;
  let service: AuthService;

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify('stale-user'));
    state = new BehaviorSubject<firebase.User>(null);
    TestBed.configureTestingModule({ providers: [
      { provide: AngularFireAuth, useValue: { user: state, idTokenResult: of(null), auth: {} } }
    ] });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.removeItem('user'));

  it('does not trust a stored UID while signed out', () => {
    expect(service.userId).toBe('');
  });

  it('follows login, account switch and logout without a component lifecycle', () => {
    state.next({ uid: 'alice' } as firebase.User);
    expect(service.userId).toBe('alice');
    state.next({ uid: 'bob' } as firebase.User);
    expect(service.userId).toBe('bob');
    state.next(null);
    expect(service.userId).toBe('');
  });
});
