import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {AdminComponent} from './component/admin/admin.component';
import {SignupComponent} from './component/signup/signup.component';
import {CartComponent} from './component/cart/cart.component';
import {ShopComponent} from './component/shop/shop.component';
import {FilterComponent} from "./component/filter/filter.component";


const routes: Routes = [
  { path: '' , component: HomeComponent },
  { path: 'admin' , component: AdminComponent },
  { path: 'login' , component: LoginComponent },
  { path: 'signup' , component: SignupComponent },
  { path: 'cart' , component: CartComponent },
  { path: 'shop' , component: ShopComponent},
  { path: 'filter' , component: FilterComponent},
  { path: '**' , component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
