import { Component,OnInit } from '@angular/core';
import * as AOS from 'aos';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'E-Commerce';


  constructor(private as: AuthService) {
  }
  ngOnInit(){
    AOS.init()

  }

}
