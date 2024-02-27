import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateUserService } from 'src/app/services/authenticate-user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  search!: string;
  constructor(
    private authenticate: AuthenticateUserService,
    private router: Router
  ) {}

  logOut() {
    this.authenticate.logout();
    this.router.navigate(['']);
  }
}
