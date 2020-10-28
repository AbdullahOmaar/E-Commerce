import {Component, HostListener, OnInit} from '@angular/core';
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


  checked1?: boolean = true;

  public screenWidth: any;

  public screenHeight: any;

  screenMop : boolean = false;

  showMainMenu : boolean = true;


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

    this.screenWidth = window.innerWidth;

    this.screenHeight = window.innerHeight;

    if (this.screenWidth <= 360) {
      this.showMainMenu = false
    }
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {

    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 360){
      this.screenMop = true
      this.showMainMenu = false

    }else {
      this.screenMop = false
      this.showMainMenu = true

    }
  }

  logout(){
    this.as.logout().then( res => console.log('logout'))
  }


  mainMenu(){
    if(this.showMainMenu == false){
      this.showMainMenu = true

    }else {
      this.showMainMenu = false

    }
  }

}

