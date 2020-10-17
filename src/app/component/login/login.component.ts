import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errMessage: string = ''
  constructor(private as: AuthService,
              private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit(): void {
  }

  login(form){
    this.errMessage = ''
    let data = form.value
    this.as.login(data.email, data.password)
      .then(res =>
        this.router.navigate(['/']))

      .catch(err =>
        this.errMessage = err.message
      )
  }

}
