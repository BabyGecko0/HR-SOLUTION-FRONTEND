import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';

import { BodyHolderComponent } from './pages/body-holder/body-holder.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { ManagerViewComponent } from './pages/manager-view/manager-view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { IgxCalendarModule, IgxSnackbarModule } from 'igniteui-angular';

import { AsyncPipe } from '@angular/common';
import { TimesheetListComponent } from './pages/timesheet-list/timesheet-list.component';
import { NotFoundViewComponent } from './pages/not-found-view/not-found-view.component';
import { EditUserViewComponent } from './pages/edit-user-view/edit-user-view.component';
import { SearchPipe } from './pipes/search.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    BodyHolderComponent,
    SignInComponent,
    SignUpComponent,
    UserViewComponent,
    ManagerViewComponent,
    TimesheetListComponent,
    NotFoundViewComponent,
    EditUserViewComponent,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    IgxCalendarModule,
    IgxSnackbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
