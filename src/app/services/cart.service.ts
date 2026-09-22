import { mapProducts } from '../features/catalog/data-access/product.mapper';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Good } from '../interface/good';
import { clampQuantity } from '../features/cart/domain/cart-estimates';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private fs: AngularFirestore, private auth: AuthService) {}

  async addToCart(data: Good): Promise<unknown> {
    const uid = await this.auth.requireUserId();
    return this.fs.collection<Good>(`users/${uid}/cart`).add({ ...data, amount: clampQuantity(data.amount) });
  }

  getCart(): Observable<Good[]> {
    return this.auth.userId$.pipe(switchMap(uid => uid
      ? this.fs.collection<Good>(`users/${uid}/cart`).snapshotChanges().pipe(map(mapProducts), startWith([]))
      : of([])));
  }

  async delete(id: string): Promise<void> {
    const uid = await this.auth.requireUserId();
    this.validateId(id);
    return this.fs.doc(`users/${uid}/cart/${id}`).delete();
  }

  async update(id: string, amount: number): Promise<void> {
    const uid = await this.auth.requireUserId();
    this.validateId(id);
    return this.fs.doc(`users/${uid}/cart/${id}`).update({ amount: clampQuantity(amount) });
  }

  private validateId(id: string): void {
    if (!id || id.includes('/')) { throw new Error('Invalid cart item.'); }
  }
}
