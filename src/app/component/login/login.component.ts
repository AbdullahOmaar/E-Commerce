import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent {
  errMessage = '';
  submitting = false;
  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) {}
  async login(form: NgForm): Promise<void> {
    if (form.invalid || this.submitting) { return; }
    this.errMessage = '';
    this.submitting = true;
    try {
      await this.auth.login(form.value.email, form.value.password);
      const target = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(target && target.startsWith('/') && !target.startsWith('//') ? target : '/');
    } catch { this.errMessage = 'Unable to sign in. Check your email and password and try again.'; }
    finally { this.submitting = false; }
  }
}
