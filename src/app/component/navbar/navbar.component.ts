import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];
  isUser: boolean = false
  constructor(private as: AuthService) { }


  ngOnInit() {
    this.as.user.subscribe(user => {
        if (user) {
          this.isUser = true
          this.as.userId = user.uid
        } else {
          this.isUser = false
          this.as.userId = ''
        }
      }
    )

  }

  logout(){
    this.as.logout().then( res => console.log('logout'))
  }
}
