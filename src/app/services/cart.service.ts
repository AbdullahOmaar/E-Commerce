import { Injectable } from '@angular/core';
import {Good} from '../interface/good';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth.service';
import {AngularFireAuth} from "@angular/fire/auth";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  user: Observable<firebase.User>
  userId: string

  constructor( private fs: AngularFirestore, private as: AuthService, private afAuth: AngularFireAuth) {
    // this.user = afAuth.user
    this.userId = JSON.parse(localStorage.getItem('user')) ;
  }

  addToCart(data: Good){
    return this.fs.collection(`users/${this.as.userId}/cart`).add(data)
  }

  getCart(){
    return this.fs.collection(`users/${this.as.userId}/cart`).snapshotChanges()
  }

  delete(id){
    return this.fs.doc(`users/${this.userId}/cart/${id}`).delete()
  }

  update(id , amount){
    return this.fs.doc(`users/${this.userId}/cart/${id}`).update({
      amount
    })
  }
}
