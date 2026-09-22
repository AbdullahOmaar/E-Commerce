import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { GoodsService } from './goods.service';

describe('GoodsService data boundary', () => {
  afterEach(() => localStorage.removeItem('selectCategory'));
  it('falls back from corrupt storage and cancels previous category listeners', () => {
    localStorage.setItem('selectCategory', 'invalid JSON');
    const opened: string[] = [];
    const closed: string[] = [];
    const fs = { collection: (path: string) => {
      opened.push(path);
      return { snapshotChanges: () => new Observable(() => () => closed.push(path)) };
    } };
    const service = new GoodsService(fs as unknown as AngularFirestore, {} as AngularFireStorage);
    const subscription = service.gitSelectedCategory().subscribe();
    service.setselectCategory('Bags');
    service.setselectCategory('Bags');
    expect(opened).toEqual(['goods/Men\'s Fashion/item', 'goods/Bags/item']);
    expect(closed).toEqual(['goods/Men\'s Fashion/item']);
    subscription.unsubscribe();
    expect(closed.length).toBe(2);
  });
  it('rejects upload failures instead of leaving creation pending', async () => {
    const storage = { ref: () => ({ put: () => Promise.reject(new Error('upload failed')), getDownloadURL: () => of('url') }) };
    const fs = { createId: () => 'image', collection: jasmine.createSpy('collection') };
    const service = new GoodsService(fs as unknown as AngularFirestore, storage as unknown as AngularFireStorage);
    let message = '';
    try { await service.addNewGood('Product', 10, '', new File(['image'], 'image.png', { type: 'image/png' }), '', '', null, 'Bags'); }
    catch (error) { message = error.message; }
    expect(message).toBe('upload failed');
    expect(fs.collection).not.toHaveBeenCalled();
  });
});
