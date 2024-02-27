import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HandleErrors } from 'src/app/models/handle-errors';
import { User } from 'src/app/models/user';
import { AuthenticateUserService } from 'src/app/services/authenticate-user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  passwordVisible = false;
  apiErrorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticate: AuthenticateUserService
  ) {}

  ngOnInit() {
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  logIn() {
    const data = this.form.getRawValue();
    this.authenticate.getUserInfo(data.username, data.password).subscribe({
      next: (user: User) => {
        if (user && user.role) {
          this.authenticate.login(user);
          const redirectPath =
            user.role === 'USER' ? '/user-view' : '/manager-view';
          console.log(redirectPath);
          this.router.navigate([redirectPath]);
        } else {
          console.log('Authentication failed.');
          this.router.navigate(['']);
        }
      },
      error: (incomingData: any) => {
        console.log(incomingData.error.message);
        this.apiErrorMessage = incomingData.error.message;
      },
    });
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
