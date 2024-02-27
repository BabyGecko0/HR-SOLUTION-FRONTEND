import { Injectable } from '@angular/core';

import { Observable, map, of } from 'rxjs';

import { CrudService } from './crud-operations.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateUserService {
  isLogin = false;
  roleAs?: string;

  constructor(private crudService: CrudService) {}

  getUserInfo(username: string, password: string): Observable<any> {
    return this.crudService.getUserLogin(username, password).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  login(user: User) {
    this.isLogin = true;
    this.roleAs = user.role;
    localStorage.setItem('STATE', 'true');
    localStorage.setItem('ROLE', this.roleAs);
    localStorage.setItem('USER_ID', user.id);
    return of({ success: this.isLogin, role: this.roleAs });
  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    localStorage.clear();
    return of({ success: this.isLogin, role: '' });
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true') this.isLogin = true;
    else this.isLogin = false;
    return this.isLogin;
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE')!;
    return this.roleAs;
  }
}
