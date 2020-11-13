import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './component/home/home.component';
import { CartComponent } from './component/cart/cart.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { AdminComponent } from './component/admin/admin.component';

import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import { FooterComponent } from './component/footer/footer.component';                  //api

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {MenubarModule} from 'primeng/menubar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//firbase
import { AngularFireModule} from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {CarouselModule} from 'primeng/carousel';
import {ToastModule} from 'primeng/toast';
import { CategoriesComponent } from './component/categories/categories.component';
import { CardComponent } from './component/card/card.component';
import { ShopComponent } from './component/shop/shop.component';
import { DataViewModule } from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TableModule} from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {ProgressBarModule} from 'primeng/progressbar';
import {ContextMenuModule} from 'primeng/contextmenu';
import {MultiSelectModule} from 'primeng/multiselect';
import {FocusTrapModule} from 'primeng/focustrap';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FileUploadModule} from 'primeng/fileupload';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import {PanelMenuModule} from 'primeng/panelmenu';
import { FilterComponent } from './component/filter/filter.component';
import {ToggleButtonModule} from "primeng/togglebutton";
import {NavbarComponent} from "./component/navbar/navbar.component";
import { GoodComponent } from './component/good/good.component';
import {OrderListModule} from "primeng/orderlist";
import {InputNumberModule} from "primeng/inputnumber";
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { MainSliderComponent } from './component/main-slider/main-slider.component';
import {TooltipModule} from "primeng/tooltip";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    LoginComponent,
    NotFoundComponent,
    AdminComponent,
    FooterComponent,
    SignupComponent,
    CategoriesComponent,
    CardComponent,
    ShopComponent,
    FilterComponent,
    NavbarComponent,
    GoodComponent,
    WishlistComponent,
    MainSliderComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AccordionModule,
    FontAwesomeModule,
    MenubarModule,
    BrowserModule,
    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    AngularFireModule.initializeApp(
      {
        apiKey: "AIzaSyCecLlLG1j4k6mH9dlUM-xKA57p77iE3mE",
        authDomain: "e-commerce-v01.firebaseapp.com",
        databaseURL: "https://e-commerce-v01.firebaseio.com",
        projectId: "e-commerce-v01",
        storageBucket: "e-commerce-v01.appspot.com",
        messagingSenderId: "175516162427",
        appId: "1:175516162427:web:118c880c344f02769545de",
        measurementId: "G-TKMCMYY69S"
      }
    ),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    CarouselModule,
    ToastModule,
    DataViewModule,
    PanelModule,
    DropdownModule,
    DialogModule,
    RatingModule,
    RippleModule,
    HttpClientModule,
    TableModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    ProgressBarModule,
    FocusTrapModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    FileUploadModule,
    OverlayPanelModule,
    PanelMenuModule,
    ToggleButtonModule,
    OrderListModule,
    InputNumberModule,
    TooltipModule,
    AccordionModule


  ],
  bootstrap: [AppComponent],
  providers: [HttpClient,MessageService,ConfirmationService],


})
export class AppModule { }
