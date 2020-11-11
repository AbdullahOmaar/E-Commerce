import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Good, Representative} from '../../interface/good';
import {NgForm} from '@angular/forms';
import {GoodsService} from '../../services/goods.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import {PrimeNGConfig} from 'primeng/api';
import {CartService} from '../../services/cart.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FileUpload, FileUploadModule} from 'primeng/fileupload';
import {CategoryService} from '../../services/category.service';
import {Category} from '../../interface/category';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class AdminComponent implements OnInit {

  @ViewChild('image') image: ElementRef
  @ViewChild('fileInput') fileInput: FileUpload;

  customers: Good[];

  product: Good[];

  editProduct: any ={};

  selectedProduct: Good[];

  representatives: any[];

  statuses: any[];

  categorys: any[];

  loading: boolean = true;


  productDialog: boolean;

  editDialog: boolean;

  submitted: boolean;

  uploadedFiles: any[] = [];

  AddCategorydisplay: boolean = false;

  Categorys : Category[] = []

  products: Category[];

  selectedCategory: Category;


  @ViewChild('dt') table: Table;

  constructor(private gs:GoodsService,
              private cs: CartService,
              private as: AuthService,
              private cgs: CategoryService,
              private router: Router,
              private primengConfig: PrimeNGConfig,
              private confirmationService: ConfirmationService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.product = []
    this.gs.gitAllGoods().subscribe(
      data => {
        this.product= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
        this.loading = false;
        console.log(this.product)
      })
    //categorys
    this.cgs.gitAllCategory().subscribe(
      data => {
        this.Categorys= data.map(element=> {
          return{
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Category
          }
        })
      })
    this.categorys = [
      {label: "Men's Fashion",name: "Men's Fashion", value: "Men's Fashion"},
      {label: "Women's Fashion",name: "Women's Fashion", value: "Women's Fashion"},
      {label: "Kid's Fashion",name: "Kid's Fashion", value: "Kid's Fashion"},
      {label: 'Sports & Fitness',name: 'Sports & Fitness', value: 'Sports & Fitness'},
      {label: 'Bags',name: 'Bags', value: 'Bags'},
      {label: 'main-slider',name: 'main-slider', value: 'main-slider'},
    ];

    this.statuses = [
      {label: 'Unqualified', value: 'unqualified'},
      {label: 'Qualified', value: 'qualified'},
      {label: 'New', value: 'new'},
      {label: 'Negotiation', value: 'negotiation'},
      {label: 'Renewal', value: 'renewal'},
      {label: 'Proposal', value: 'proposal'}
    ]
    this.primengConfig.ripple = true;
  }

  onActivityChange(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
      const activity = parseInt(value);

      if (!isNaN(activity)) {
        this.table.filter(activity, 'activity', 'gte');
      }
    }
  }

  onDateSelect(value) {
    this.table.filter(this.formatDate(value), 'date', 'equals')
  }

  formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return  day + '-' + month + '-' + date.getFullYear() ;
  }

  onRepresentativeChange(event) {
    this.table.filter(event.value, 'representative', 'in')
  }





  addNewGood(form: NgForm){
    let
      name  =(<Good>form.value).name,
      price =(<Good>form.value).price,
      description =(<Good>form.value).description,
      image =(<HTMLInputElement>this.image.nativeElement).files[0],
      country =(<Good>form.value).country,
      status =(<Good>form.value).status,
      date =(<Good>form.value).date,
      category =(<Good>form.value).category
    this.gs.addNewGood(name, price, description, image, country, status, date, category).then(
      res => console.log(res)
    )
      .catch(res => console.log(res.message))
    this.productDialog = false;
  }

  openNew() {
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }



// service

  AddCategoryDialog() {
    this.AddCategorydisplay = true;
  }
  public onSelectImage(evt: any) {
    this.uploadedFiles = evt[0];
  }

  AddNewCategory(form: NgForm, evt: any){
    let
      name  =(<Good>form.value).name,
      description =(<Good>form.value).description,
      image = this.uploadedFiles
      this.cgs.AddCategory(name,description, image).then(
      res => console.log(res),
    ).then(
        res => this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000})
      )
      .catch(res => console.log(res.message))
     this.uploadedFiles  = []
      form.reset()
       this.AddCategorydisplay=false

  }






  // updateDialogt
  updateDialog(product){
    this.editProduct = product
    console.log(this.editProduct.id)
    this.editDialog = true
  }

  // update product
  update(form: NgForm){
    let
      id = this.editProduct.id,
      name  =(<Good>form.value).name,
      price =(<Good>form.value).price,
      description =(<Good>form.value).description,
      image =(<HTMLInputElement>this.image.nativeElement).files[0],
      country =(<Good>form.value).country,
      status =(<Good>form.value).status,
      date =(<Good>form.value).date,
      category =(<Good>form.value).category
      this.gs.update(id,name, price, description, image, country, status, date, category).then(
      res => console.log(res)
    )
      .catch(res => console.log(res.message))
    this.productDialog = false;

  }

  // delete product
  deleteProduct(product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gs.deleteitem( product.category,product.id)
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
      }
    });
  }

  onRowSelect(event) {
    this.messageService.add({severity: 'info', summary: 'Product Selected', detail: event.data.name});
    this.gitCategory(event.data.name)
  }
  gitCategory(selectedCategory) {
    this.gs.gitCategory(selectedCategory).subscribe(
      data => {
        this.product = data.map(element => {
          return {
            id: element.payload.doc.id,
            ...element.payload.doc.data() as Good
          }
        })
        this.loading = false;
        console.log(this.product)
      })
  }


}
