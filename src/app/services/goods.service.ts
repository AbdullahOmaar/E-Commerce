import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {rejects} from 'assert';
import {Observable, of} from "rxjs";
import {Good} from "../interface/good";
import {MessageService} from "primeng/api";
import {ShopComponent} from "../component/shop/shop.component";

@Injectable({
  providedIn: 'root'

})

export class GoodsService {

   // status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];


  constructor(private fs: AngularFirestore,
              private storage: AngularFireStorage,
              private messageService: MessageService,
              ) { }

  // share data for cart && categories item
  Data : any
  setData(data){
    this.Data = data
    console.log(this.Data)
  }
  getData(){
    return this.Data
  }
  // share  Select categories
  setselectCategory(categories){
    localStorage.setItem('selectCategory', JSON.stringify(categories));
    console.log(JSON.parse(localStorage.getItem('selectCategory')));
    this.gitSelectedCategory()
  }
  // endSelect categories

  gitAllGoods() {
    return this.fs.collection(`goods/Men's Fashion/item`).snapshotChanges()
  }

  gitSelectedCategory() {
    return this.fs.collection(`goods/${JSON.parse(localStorage.getItem('selectCategory'))}/item`).snapshotChanges()
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


  addNewGood(name: string, price: number,description: string, image: File, country: any, status: string, date: Date, category: string ){
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref('goods/' + image.name)
      ref.put(image).then(() =>{
        ref.getDownloadURL().subscribe(photoUrl => {
          console.log(photoUrl)
          this.fs.collection(`goods/${category}/item` ).add({
            name,
            price,
            description,
            photoUrl,
            country,
            status,
            date,
            category
          }).then(() => resolve(this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000})))
        })
      })
    })
  }

  update(id ,name: string, price: number,description: string, image: File, country: any, status: string, date: Date, category: string ){
    console.log(id , 'category')
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref('goods/' + image.name)
      ref.put(image).then(() =>{
        ref.getDownloadURL().subscribe(photoUrl => {
          this.fs.doc(`goods/${category}/item/${id}` ).update({
            name,
            price,
            description,
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
