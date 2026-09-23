import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { CategoryService } from './category.service';

describe('CategoryService upload failures', () => {
  it('propagates a failed database write after upload', async () => {
    const storage = { ref: () => ({ put: () => Promise.resolve(), getDownloadURL: () => of('https://example.com/image.png') }) };
    const fs = { createId: () => 'image', collection: () => ({ add: () => Promise.reject(new Error('denied')) }) };
    const service = new CategoryService(fs as unknown as AngularFirestore, storage as unknown as AngularFireStorage);
    let message = '';
    try { await service.AddCategory('Bags', '', new File(['image'], 'image.png', { type: 'image/png' })); }
    catch (error) { message = error.message; }
    expect(message).toBe('denied');
  });
});
