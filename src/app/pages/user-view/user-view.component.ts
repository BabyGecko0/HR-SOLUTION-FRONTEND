import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, catchError, map, of, tap } from 'rxjs';
import {
  GetUserResponse,
  TimesheetDetails,
} from 'src/app/models/get-user-response';
import { User } from 'src/app/models/user';
import { CrudService } from 'src/app/services/crud-operations.service';
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDatepickerConfig,
  NgbDate,
} from '@ng-bootstrap/ng-bootstrap';
import { TimesheetRequest } from 'src/app/models/timesheet-request';
import { AbstractControl, FormBuilder, FormGroup, NgModel, ValidationErrors, Validators } from '@angular/forms';
import { Status } from 'src/app/models/status';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  userData!: GetUserResponse;
  id = localStorage.getItem('USER_ID');
  note: string = '';
  vacationForm!: FormGroup;
  showPassword: boolean = false;
  disabledDates: NgbDateStruct[] = [];
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;

  onPasswordOff() {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private crudService: CrudService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig
  ) {
    this.vacationForm = this.fb.group({
      note: ['', Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, [Validators.required, this.validateToDate.bind(this)]],
    });

    this.minDate = calendar.getToday();
    const currentYear = new Date().getFullYear();
    this.maxDate = { year: currentYear, month: 12, day: 31 };
  }

  ngOnInit(): void {
    this.loadUserInformation();
  }

  loadUserInformation() {
    if (this.id != null) {
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

  onRequestButtonClick(): void {
    if (this.vacationForm.valid) {
      const fromDate = this.vacationForm.value.fromDate;
      const toDate = this.vacationForm.value.toDate;
      const note = this.vacationForm.value.note;
      const createdBy = this.userData.username;
  
      // Check if the fromDate is before or equal to the toDate
      if (this.isBefore(fromDate, toDate) || this.isEqual(fromDate, toDate)) {
        const request: TimesheetRequest = {
          fromDate: fromDate !== null ? new Date(fromDate.year, fromDate.month - 1, fromDate.day + 1) : null,
          toDate: toDate !== null ? new Date(toDate.year, toDate.month - 1, toDate.day + 1) : null,
          note,
          createdBy,
        };
  
        const subscription: Subscription = this.crudService
          .createTimesheet(this.id ?? '', request)
          .subscribe({
            next: (response) => {
              alert('Vacation request submitted successfully!');
              console.log('Vacation request submitted successfully:', response);
            },
            error: (error) => {
              console.error('Error submitting vacation request:', error);
            },
            complete: () => {
              console.log('Vacation request submission completed');
            },
          });
      } else {
        alert('Invalid date range. Please select a valid date range.');
      }
    } else {
      alert('Please fill out all required fields and select a valid date range.');
    }
  }
  

  getStatusStyle(status: Status): any {
    let color: string;
    let border: string;

    switch (status) {
      case Status.Active:
        color = 'green';
        border = '3px solid green';
        break;
      case Status.Pending:
        color = 'yellow';
        border = '3px solid yellow';
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
      for (const timesheet of this.userData.timesheetDetails) {
        const fromDate: NgbDateStruct = {
          year: new Date(timesheet.fromDate).getFullYear(),
          month: new Date(timesheet.fromDate).getMonth() + 1,
          day: new Date(timesheet.fromDate).getDate(),
        };

        const toDate: NgbDateStruct = {
          year: new Date(timesheet.toDate).getFullYear(),
          month: new Date(timesheet.toDate).getMonth() + 1,
          day: new Date(timesheet.toDate).getDate(),
        };

        if (timesheet.status === 'ACTIVE')
          this.disabledDates = this.disabledDates.concat(
            this.getDatesArray(fromDate, toDate)
          );

        const timesheetId = timesheet.id.toString();
        this.crudService.getTimesheetById(timesheetId).subscribe({
          next: (response) => {
            console.log('Timesheet data received:', response);
          },
          error: (error) => {
            console.error('Error loading timesheet:', error);
          },
        });
      }
    }
  }
  getDatesArray(
    startDate: NgbDateStruct,
    endDate: NgbDateStruct
  ): NgbDateStruct[] {
    const datesArray: NgbDateStruct[] = [];
    let currentDate = { ...startDate };

    while (
      this.isBefore(currentDate, endDate) ||
      this.isEqual(currentDate, endDate)
    ) {
      datesArray.push({ ...currentDate });
      currentDate = this.getNextDate(currentDate);
    }

    return datesArray;
  }

  isBefore(date1: NgbDateStruct, date2: NgbDateStruct): boolean {
    if (date1.year < date2.year) {
      return true;
    } else if (date1.year === date2.year) {
      if (date1.month < date2.month) {
        return true;
      } else if (date1.month === date2.month) {
        return date1.day < date2.day;
      }
    }
    return false;
  }

  getNextDate(date: NgbDateStruct): NgbDateStruct {
    const nextDate = { ...date };
    const lastDayOfMonth = new Date(nextDate.year, nextDate.month, 0).getDate();

    if (nextDate.day < lastDayOfMonth) {
      nextDate.day++;
    } else {
      nextDate.day = 1;
      if (nextDate.month < 12) {
        nextDate.month++;
      } else {
        nextDate.month = 1;
        nextDate.year++;
      }
    }
    return nextDate;
  }
  beforeDateDisabled = (date: NgbDate) => {
    return this.isDateDisabled(date);
  };

  isDateDisabled(date: NgbDate): boolean {
    const dateToCheck = { year: date.year, month: date.month, day: date.day };
    return this.disabledDates.some((d) => this.isEqual(d, dateToCheck));
  }

  isEqual(date1: NgbDateStruct, date2: NgbDateStruct): boolean {
    return (
      date1.year === date2.year &&
      date1.month === date2.month &&
      date1.day === date2.day
    );
  }

  getDisabledDatesInRange(
    startDate: NgbDateStruct,
    endDate: NgbDateStruct
  ): NgbDateStruct[] {
    const disabledDatesInRange: NgbDateStruct[] = [];
    const allDisabledDates = this.disabledDates;

    for (const date of allDisabledDates) {
      if (this.isInRange(date, startDate, endDate)) {
        disabledDatesInRange.push(date);
      }
    }

    return disabledDatesInRange;
  }

  isInRange(
    date: NgbDateStruct,
    startDate: NgbDateStruct,
    endDate: NgbDateStruct
  ): boolean {
    return (
      this.isEqualOrAfter(date, startDate) &&
      this.isEqualOrBefore(date, endDate)
    );
  }

  isEqualOrAfter(date1: NgbDateStruct, date2: NgbDateStruct): boolean {
    return this.isEqual(date1, date2) || this.isAfter(date1, date2);
  }

  isEqualOrBefore(date1: NgbDateStruct, date2: NgbDateStruct): boolean {
    return this.isEqual(date1, date2) || this.isBefore(date1, date2);
  }

  isAfter(date1: NgbDateStruct, date2: NgbDateStruct): boolean {
    if (date1.year > date2.year) {
      return true;
    } else if (date1.year === date2.year) {
      if (date1.month > date2.month) {
        return true;
      } else if (date1.month === date2.month) {
        return date1.day > date2.day;
      }
    }
    return false;
  }
  validateToDate(control: AbstractControl): ValidationErrors | null {
    if (this.vacationForm && this.vacationForm.get('fromDate') && control.value) {
      const fromDateValue = this.vacationForm.get('fromDate')?.value;
  
      if (fromDateValue) {
        const fromDate = new Date(fromDateValue.year, fromDateValue.month - 1, fromDateValue.day);
        const toDate = new Date(control.value.year, control.value.month - 1, control.value.day);
  
        if (fromDate > toDate) {
          return { invalidDateRange: true };
        }
      }
    }
  
    return null;
  }
  
}
