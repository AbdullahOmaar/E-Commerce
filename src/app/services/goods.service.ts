import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {rejects} from 'assert';
import {Observable, of} from "rxjs";
import {Good} from "../interface/good";

@Injectable({
  providedIn: 'root'
})
export class GoodsService {

   // status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];


  constructor(private fs: AngularFirestore, private storage: AngularFireStorage) { }

  gitAllGoods() {
    return this.fs.collection(`goods/Men's Fashion/item`).snapshotChanges()
  }

  mainslider() {
    return this.fs.collection(`goods/main-slider/item`).snapshotChanges()
  }

  gitCategory(category) {
    return this.fs.collection(`goods/${category}/item`).snapshotChanges()
  }

  deleteitem(category, id){
    return this.fs.doc(`goods/${category}/item/${id}`).delete()
  }
  // share data for cart item
    add : any
  setData(data){
    this.add = data
  }
  getData(){
    return this.add
  }
  // End //

  addNewGood(name: string, price: number,discription: string, image: File, country: any, status: string, date: Date, category: string ){
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref('goods/' + image.name)
      ref.put(image).then(() =>{
        ref.getDownloadURL().subscribe(photoUrl => {
          console.log(photoUrl)
          this.fs.collection(`goods/${category}/item` ).add({
            name,
            price,
            discription,
            photoUrl,
            country,
            status,
            date,
            category
          }).then(() => resolve('add sucss'))
        })
      })
    })
  }

  update(id ,name: string, price: number,discription: string, image: File, country: any, status: string, date: Date, category: string ){
    console.log(id , 'category')
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref('goods/' + image.name)
      ref.put(image).then(() =>{
        ref.getDownloadURL().subscribe(photoUrl => {
          this.fs.doc(`goods/${category}/item/${id}` ).update({
            name,
            price,
            discription,
            photoUrl,
            country,
            status,
            date,
            category
          }).then(() => resolve('update sucss'))
        })
      })
    })
  }
}
