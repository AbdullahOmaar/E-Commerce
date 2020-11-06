import { Injectable } from '@angular/core';
import {Good} from "../interface/good";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  userId: string

  constructor(private fs: AngularFirestore,) {
    this.userId = JSON.parse(localStorage.getItem('user')) ;
  }

  addToWishlist(data: Good){
    return this.fs.collection(`users/${this.userId}/wishlist`).add(data)
  }

  getWishlist(){
    return this.fs.collection(`users/${this.userId}/wishlist`).snapshotChanges()
  }

  delete(id){
    return this.fs.doc(`users/${this.userId}/wishlist/${id}`).delete()
  }

  update(id , amount){
    return this.fs.doc(`users/${this.userId}/wishlist/${id}`).update({
      amount
    })
  }
}
