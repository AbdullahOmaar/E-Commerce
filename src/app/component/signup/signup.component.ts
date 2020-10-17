import { Component, OnInit } from '@angular/core';
import {User} from '../../interface/user';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errMessage: string = ''
  constructor(private as: AuthService,
              private us: UserService,
              private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
  }


  signup(form){
    let data: User= form.value
    this.as.signup(data.email, data.password).then(res => {
      this.errMessage = ''
      this.us.addNewUser(res.user.uid, data.name, data.phone).then(()=>{
        this.router.navigate(['/'])
      }).catch(err => console.log('dd',err))
      })
      .catch(err => {
              this.errMessage = err.message + 'ss'
            })
      }
}
