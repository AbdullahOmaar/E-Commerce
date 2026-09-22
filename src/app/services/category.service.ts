import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Category } from '../interface/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private fs: AngularFirestore, private storage: AngularFireStorage) {}

  async AddCategory(name: string, description: string, image: File): Promise<unknown> {
    if (!name || name.includes('/') || !image || !/^image\/(jpeg|png|webp|gif|avif)$/.test(image.type)
        || image.size > 5 * 1024 * 1024) { throw new Error('A category needs a name and a supported image under 5 MB.'); }
    const ref = this.storage.ref(`category/${this.fs.createId()}`);
    await ref.put(image);
    const photoUrl = await ref.getDownloadURL().pipe(take(1)).toPromise();
    return this.fs.collection<Category>('category').add({ name, description: description || '', photoUrl });
  }

  gitAllCategory(): Observable<Category[]> {
    return this.fs.collection<Category>('category').snapshotChanges().pipe(map(actions => actions.map(action => ({
      ...action.payload.doc.data(), id: action.payload.doc.id
    }))));
  }
}
