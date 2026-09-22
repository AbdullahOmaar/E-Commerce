import { mapProducts } from '../features/catalog/data-access/product.mapper';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Good } from '../interface/good';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private fs: AngularFirestore, private auth: AuthService) {}

  async addToWishlist(data: Good): Promise<unknown> {
    const uid = await this.auth.requireUserId();
    return this.fs.collection<Good>(`users/${uid}/wishlist`).add(data);
  }

  getWishlist(): Observable<Good[]> {
    return this.auth.userId$.pipe(switchMap(uid => uid
      ? this.fs.collection<Good>(`users/${uid}/wishlist`).snapshotChanges().pipe(map(mapProducts), startWith([]))
      : of([])));
  }

  async delete(id: string): Promise<void> {
    const uid = await this.auth.requireUserId();
    if (!id || id.includes('/')) { throw new Error('Invalid wishlist item.'); }
    return this.fs.doc(`users/${uid}/wishlist/${id}`).delete();
  }
}
