import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private fs: AngularFirestore, private storage: AngularFireStorage) { }

  AddCategory(name: string,description, image: any, ){
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref('category/' + image.name)
      ref.put(image).then(() =>{
        ref.getDownloadURL().subscribe(photoUrl => {
          console.log(photoUrl)
          this.fs.collection(`category/` ).add({
            name,
            description,
            photoUrl,
          }).then(() => resolve('add sucss'))
        })
      })
    })
  }

  gitAllCategory() {
    return this.fs.collection(`category/`).snapshotChanges()
  }

}
