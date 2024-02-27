import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import {
  GetUserResponse,
  TimesheetDetails,
} from 'src/app/models/get-user-response';
import { Status } from 'src/app/models/status';
import { TimesheetRequest } from 'src/app/models/timesheet-request';
import { CrudService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
})
export class TimesheetListComponent {
  userData!: GetUserResponse;
  id = localStorage.getItem('USER_ID');
  note: string = '';
  vacationForm!: FormGroup;
  sortOrder: 'asc' | 'desc' = 'asc';

  showPassword: boolean = false;

  onPasswordOff() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private crudService: CrudService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.vacationForm = this.fb.group({
      note: ['', Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUserInformation();
  }

  loadUserInformation() {
    if (this.id != null) {
      console.log(this.id, 'userId');
      this.crudService
        .getUserById(this.id)
        .pipe(
          tap((data) => console.log('User data received:', data)),
          map((responseData) => this.mapResponseToData(responseData)),
          catchError((error) => {
            console.error('Error loading contact:', error);
            return of(null);
          })
        )
        .subscribe((userData) => {
          if (userData) {
            this.userData = userData;
            this.fetchTimesheetsForUser();
          }
        });
    }
  }

  mapResponseToData(responseData: any): GetUserResponse {
    return new GetUserResponse(
      responseData.username,
      responseData.firstName,
      responseData.lastName,
      responseData.password,
      responseData.role,
      responseData.daysOff,
      this.mapTimesheetDetails(responseData.timesheetDetails)
    );
  }

  mapTimesheetDetails(timesheetDetailsArray: any[]): TimesheetDetails[] {
    return timesheetDetailsArray.map((details) => {
      return new TimesheetDetails(
        details.fromDate,
        details.toDate,
        details.note,
        details.status,
        details.createdAt,
        details.createdBy,
        details.modifiedAt,
        details.modifiedBy
      );
    });
  }

  getStatusStyle(status: Status): any {
    let color: string;
    let border: string;

    switch (status) {
      case Status.Active:
        color = 'green';
        border = '4px solid green';
        break;
      case Status.Pending:
        color = 'yellow';
        border = '3px solid orange';
        break;
      case Status.Rejected:
        color = 'red';
        border = '3px solid red';
        break;
      default:
        color = 'black';
        border = 'none';
    }

    return { color, border };
  }

  fetchTimesheetsForUser() {
    if (this.userData && this.userData.timesheetDetails) {
      this.userData.timesheetDetails = this.userData.timesheetDetails.sort(
        (a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();

          return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
      );
    }
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.fetchTimesheetsForUser();
  }
}
