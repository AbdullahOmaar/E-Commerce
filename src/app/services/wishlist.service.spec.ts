import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, of } from 'rxjs';
import { WishlistService } from './wishlist.service';
import { AuthService } from './auth.service';

describe('WishlistService identity', () => {
  it('clears on logout and uses the new account for writes', async () => {
    const uid = new BehaviorSubject('alice');
    const auth = { userId$: uid, requireUserId: () => uid.value ? Promise.resolve(uid.value) : Promise.reject(new Error('Sign in')) };
    const fs = { collection: jasmine.createSpy('collection').and.returnValue({ snapshotChanges: () => of([]),
      add: () => Promise.resolve() }), doc: jasmine.createSpy('doc').and.returnValue({ delete: () => Promise.resolve() }) };
    const service = new WishlistService(fs as unknown as AngularFirestore, auth as unknown as AuthService);
    const sub = service.getWishlist().subscribe(lines => expect(lines).toEqual([]));
    uid.next('');
    expect(fs.collection.calls.count()).toBe(1);
    uid.next('bob');
    await service.delete('line');
    expect(fs.doc).toHaveBeenCalledWith('users/bob/wishlist/line');
    uid.next('');
    let rejected = false;
    try { await service.addToWishlist({}); } catch { rejected = true; }
    expect(rejected).toBe(true);
    sub.unsubscribe();
  });
});
