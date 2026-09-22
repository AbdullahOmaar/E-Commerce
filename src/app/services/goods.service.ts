import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { Country, Good } from '../interface/good';
import { mapProducts } from '../features/catalog/data-access/product.mapper';

@Injectable({ providedIn: 'root' })
export class GoodsService {
  private selectedProduct: Good;
  private readonly category = new BehaviorSubject(this.readCategory());

  constructor(private fs: AngularFirestore, private storage: AngularFireStorage) {}
  setData(data: Good): void { this.selectedProduct = { ...data }; }
  getData(): Good { return this.selectedProduct; }

  setselectCategory(category: string): void {
    this.validateSegment(category);
    this.category.next(category);
    try { localStorage.setItem('selectCategory', JSON.stringify(category)); } catch { /* Storage is optional. */ }
  }

  gitAllGoods(): Observable<Good[]> { return this.gitCategory('Men\'s Fashion'); }
  mainslider(): Observable<Good[]> { return this.gitCategory('main-slider'); }
  gitSelectedCategory(): Observable<Good[]> {
    return this.category.pipe(distinctUntilChanged(), switchMap(category => this.gitCategory(category)));
  }
  gitCategory(category: string): Observable<Good[]> {
    this.validateSegment(category);
    return this.fs.collection<Good>(`goods/${category}/item`).snapshotChanges().pipe(map(mapProducts));
  }
  deleteitem(category: string, id: string): Promise<void> {
    this.validateSegment(category);
    this.validateSegment(id);
    return this.fs.doc(`goods/${category}/item/${id}`).delete();
  }

  async addNewGood(name: string, price: number, description: string, image: File,
                   country: Country | string, status: string, date: Date, category: string): Promise<unknown> {
    this.validateProduct(name, price, category);
    const photoUrl = await this.upload(image);
    return this.fs.collection(`goods/${category}/item`).add({
      name, price: Number(price), description: description || '', photoUrl,
      country: country || '', status: status || '', date: date || new Date(), category
    });
  }

  async update(id: string, name: string, price: number, description: string, image: File,
               country: Country | string, status: string, date: Date, category: string): Promise<void> {
    this.validateProduct(name, price, category);
    this.validateSegment(id);
    const photo = image ? { photoUrl: await this.upload(image) } : {};
    return this.fs.doc(`goods/${category}/item/${id}`).update({
      name, price: Number(price), description: description || '', ...photo,
      country: country || '', status: status || '', ...(date ? { date } : {}), category
    });
  }

  private async upload(image: File): Promise<string> {
    if (!image || !/^image\/(jpeg|png|webp|gif|avif)$/.test(image.type) || image.size > 5 * 1024 * 1024) {
      throw new Error('Choose a supported image smaller than 5 MB.');
    }
    const ref = this.storage.ref(`goods/${this.fs.createId()}`);
    await ref.put(image);
    return ref.getDownloadURL().pipe(take(1)).toPromise();
  }
  private readCategory(): string {
    try {
      const value: unknown = JSON.parse(localStorage.getItem('selectCategory'));
      if (typeof value === 'string' && value.trim() && !value.includes('/')) { return value; }
    } catch { /* Missing, unavailable or malformed storage uses the default category. */ }
    return 'Men\'s Fashion';
  }
  private validateSegment(value: string): void {
    if (typeof value !== 'string' || !value.trim() || value.includes('/')) { throw new Error('Invalid product reference.'); }
  }
  private validateProduct(name: string, price: number, category: string): void {
    this.validateSegment(category);
    if (!name || !String(price).trim() || !Number.isFinite(Number(price)) || Number(price) < 0) {
      throw new Error('A product needs a name and a valid price.');
    }
  }
}
