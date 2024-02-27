import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserRole } from 'src/app/models/user-role';
import { CrudService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  signupForm!: FormGroup;
  UserRole = UserRole;
  apiErrorMessage!: string;
  passwordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private crudService: CrudService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formIntialization();
  }

  formIntialization() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  signUpNewUser() {
    if (this.signupForm.valid) {
      const userRequest = this.signupForm.getRawValue();
      let user: User = new User();
      user.firstName = userRequest.firstName;
      user.lastName = userRequest.lastName;
      user.username = userRequest.username;
      user.password = userRequest.password;

      this.crudService.createUserBySignUp(user).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.router.navigate(['']);
        },
        error: (incomingData) => {
          this.apiErrorMessage = 'Username is already taken';
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
