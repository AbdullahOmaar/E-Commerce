import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/login/login.component';
import {AdminComponent} from './component/admin/admin.component';
import {SignupComponent} from './component/signup/signup.component';
import {CartComponent} from './component/cart/cart.component';
import {ShopComponent} from './component/shop/shop.component';
import {FilterComponent} from './component/filter/filter.component';
import {GoodComponent} from './component/good/good.component';
import {WishlistComponent} from './component/wishlist/wishlist.component';


export const routes: Routes = [
  { path: '' , component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'admin' , component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'login' , component: LoginComponent },
  { path: 'signup' , component: SignupComponent },
  { path: 'cart' , component: CartComponent, canActivate: [AuthGuard] },
  { path: 'shop' , component: ShopComponent, },
  { path: 'filter' , component: FilterComponent},
  { path: 'good' , component: GoodComponent},
  { path: 'wishlist' , component: WishlistComponent, canActivate: [AuthGuard]},
  { path: '**' , component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
