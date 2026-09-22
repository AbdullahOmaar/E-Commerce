import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interface/user';

@Component({ selector: 'app-signup', templateUrl: './signup.component.html', styleUrls: ['./signup.component.scss'] })
export class SignupComponent {
  errMessage = '';
  submitting = false;
  constructor(private auth: AuthService, private users: UserService, private router: Router) {}
  async signup(form: NgForm): Promise<void> {
    if (form.invalid || this.submitting) { return; }
    this.errMessage = '';
    this.submitting = true;
    const data: User = form.value;
    let created = false;
    try {
      const result = await this.auth.signup(data.email, data.password);
      created = true;
      await this.users.addNewUser(result.user.uid, data.name, data.phone);
      await this.router.navigate(['/']);
    } catch {
      this.errMessage = created
        ? 'Your account was created, but your profile could not be saved. Sign in with this email; do not register again.'
        : 'Unable to create an account. Check your details or sign in if you already have an account.';
    } finally { this.submitting = false; }
  }
}
