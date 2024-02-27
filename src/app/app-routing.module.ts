import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BodyHolderComponent } from './pages/body-holder/body-holder.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { ManagerViewComponent } from './pages/manager-view/manager-view.component';
import { AuthGuard } from './guards/authentication-guard';
import { TimesheetListComponent } from './pages/timesheet-list/timesheet-list.component';
import { NotFoundViewComponent } from './pages/not-found-view/not-found-view.component';
import { EditUserViewComponent } from './pages/edit-user-view/edit-user-view.component';

const routes: Routes = [
  { path: 'bodyholder', component: BodyHolderComponent },
  { path: '', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'user-view',
    component: UserViewComponent,
    canActivate: [AuthGuard],
    data: { role: 'USER' },
  },
  {
    path: 'manager-view',
    component: ManagerViewComponent,
    canActivate: [AuthGuard],
    data: { role: 'MANAGER' },
  },
  {
    path: 'edit-user/:id',
    component: EditUserViewComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'USER'] },
  },
  {
    path: 'timesheet',
    component: TimesheetListComponent,
    canActivate: [AuthGuard],
    data: { role: 'USER' },
  },
  { path: '**', component: NotFoundViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
