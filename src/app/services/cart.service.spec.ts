import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

describe('CartService UID boundary', () => {
  let uid: BehaviorSubject<string>;
  let service: CartService;
  let fs: { collection: jasmine.Spy; doc: jasmine.Spy };
  let update: jasmine.Spy;
  let remove: jasmine.Spy;

  beforeEach(() => {
    uid = new BehaviorSubject('alice');
    update = jasmine.createSpy('update').and.returnValue(Promise.resolve());
    remove = jasmine.createSpy('delete').and.returnValue(Promise.resolve());
    fs = { collection: jasmine.createSpy('collection').and.returnValue({
      add: jasmine.createSpy('add').and.returnValue(Promise.resolve()), snapshotChanges: () => of([])
    }), doc: jasmine.createSpy('doc').and.returnValue({ update, delete: remove }) };
    const auth = { userId$: uid, requireUserId: () => uid.value ? Promise.resolve(uid.value) : Promise.reject(new Error('Sign in')) };
    service = new CartService(fs as unknown as AngularFirestore, auth as unknown as AuthService);
  });

  it('uses the current account for add, update and delete', async () => {
    await service.addToCart({ name: 'Test', amount: 2 });
    expect(fs.collection).toHaveBeenCalledWith('users/alice/cart');
    uid.next('bob');
    await service.update('line', 200);
    await service.delete('line');
    expect(fs.doc).toHaveBeenCalledWith('users/bob/cart/line');
    expect(update).toHaveBeenCalledWith({ amount: 99 });
    expect(remove).toHaveBeenCalled();
  });

  it('rejects writes when signed out without a database call', async () => {
    uid.next('');
    for (const action of [() => service.addToCart({}), () => service.update('line', 1), () => service.delete('line')]) {
      let rejected = false;
      try { await action(); } catch { rejected = true; }
      expect(rejected).toBe(true);
    }
    expect(fs.doc).not.toHaveBeenCalled();
    expect(fs.collection).not.toHaveBeenCalled();
  });

  it('cancels old account listeners and clears visible lines on sign-out', () => {
    const closed: string[] = [];
    fs.collection.and.callFake((path: string) => ({ snapshotChanges: () => new Observable(() => () => closed.push(path)) }));
    const subscription = service.getCart().subscribe(lines => expect(lines).toEqual([]));
    uid.next('bob');
    expect(closed).toEqual(['users/alice/cart']);
    uid.next('');
    expect(closed).toEqual(['users/alice/cart', 'users/bob/cart']);
    expect(fs.collection.calls.count()).toBe(2);
    subscription.unsubscribe();
  });

  it('rejects nested document paths', async () => {
    let rejected = false;
    try { await service.delete('other/item'); } catch { rejected = true; }
    expect(rejected).toBe(true);
    expect(fs.doc).not.toHaveBeenCalled();
  });
});
