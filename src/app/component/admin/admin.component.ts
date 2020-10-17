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

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class AdminComponent implements OnInit {

  @ViewChild('image') image: ElementRef

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




  @ViewChild('dt') table: Table;

  constructor(private gs:GoodsService,
              private cs: CartService,
              private as: AuthService,
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
    this.categorys = [
      {label: "men's",name: "men's", value: "men's"},
      {label: "Women's",name: "Women's", value: "Women's"},
      {label: "Kid's",name: "Kid's", value: "Kid's"},
      {label: 'Sports & Fitness',name: 'Sports & Fitness', value: 'Sports & Fitness'},
      {label: 'Bags',name: 'Bags', value: 'Bags'},
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
      discription =(<Good>form.value).discription,
      image =(<HTMLInputElement>this.image.nativeElement).files[0],
      country =(<Good>form.value).country,
      status =(<Good>form.value).status,
      date =(<Good>form.value).date,
      category =(<Good>form.value).category
    this.gs.addNewGood(name, price, discription, image, country, status, date, category).then(
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
  gitCategory(category) {
    this.gs.gitCategory(category).subscribe(
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

  // edit product
  edit(product){
    this.editProduct = product
    this.editProduct.data
    console.log(this.editProduct.data)
    this.editDialog = true
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

}
