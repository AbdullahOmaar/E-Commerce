import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fs: AngularFirestore) { }

    addNewUser(id: string, name: string, phone: string): Promise<void>{
    return this.fs.doc('users/' + id).set({
      name,
      phone,
    });
  }
}
