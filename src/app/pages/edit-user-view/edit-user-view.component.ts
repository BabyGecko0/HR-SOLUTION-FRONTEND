import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { EditTimesheetRequest } from 'src/app/models/edit-timesheet-request';
import { Status } from 'src/app/models/status';
import { TimesheetResponse } from 'src/app/models/timesheet-response';
import { CrudService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-edit-user-view',
  templateUrl: './edit-user-view.component.html',
  styleUrls: ['./edit-user-view.component.scss'],
})
export class EditUserViewComponent implements OnInit {
  form: FormGroup;
  timesheetId!: string;
  timesheetDetails: any;
  isDisabled = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private crudService: CrudService
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.timesheetId = this.route.snapshot.params['id'];
    this.fetchTimesheetDetails();
  }

  fetchTimesheetDetails() {
    this.crudService.getTimesheetById(this.timesheetId).subscribe({
      next: (timesheetDetails) => {
        console.log('Timesheet Details:', timesheetDetails);

        this.form.patchValue({
          firstName: timesheetDetails.userDetails.firstName,
          lastName: timesheetDetails.userDetails.lastName,
          username: timesheetDetails.userDetails.username,
          note: timesheetDetails.note,
        });

        if (
          timesheetDetails.timesheetDetails &&
          timesheetDetails.timesheetDetails.length > 0
        ) {
          console.log(
            'Timesheet Details Array:',
            timesheetDetails.timesheetDetails
          );

          const formattedTimesheetDetails = {
            ...timesheetDetails.timesheetDetails[0],
            fromDate: new Date(timesheetDetails.timesheetDetails[0].fromDate),
            toDate: new Date(timesheetDetails.timesheetDetails[0].toDate),
          };

          this.timesheetDetails = formattedTimesheetDetails;
        } else {
          console.log('Timesheet Details Array is empty or not defined');
        }
      },
      error: (error) => {
        console.error('Error fetching timesheet details', error);
      },
    });
  }

  onSave() {
    if (this.form.valid) {
      const editTimesheetRequest = new EditTimesheetRequest(
        this.form.value.username,
        this.form.value.firstName,
        this.form.value.lastName,
        this.form.value.status
      );

      this.crudService
        .editTimesheetById(this.timesheetId, editTimesheetRequest)
        .subscribe({
          next: (response) => {
            console.log('User information saved successfully:', response);

            this.router.navigate(['/manager-view']);
          },
          error: (error) => {
            console.error('Error saving user information', error);
          },
        });
    }
  }

  onReject() {
    if (this.form.valid) {
      const editTimesheetRequest = new EditTimesheetRequest(
        this.form.value.username,
        this.form.value.firstName,
        this.form.value.lastName,
        Status.Rejected
      );

      this.crudService
        .editTimesheetById(this.timesheetId, editTimesheetRequest)
        .subscribe({
          next: (response) => {
            console.log('User information saved successfully:', response);
            this.router.navigate(['/manager-view']);
          },
          error: (error) => {
            console.error('Error saving user information', error);
          },
        });
    }
  }

  onApprove() {
    if (this.form.valid) {
      const editTimesheetRequest = new EditTimesheetRequest(
        this.form.value.username,
        this.form.value.firstName,
        this.form.value.lastName,
        Status.Active
      );

      this.crudService
        .editTimesheetById(this.timesheetId, editTimesheetRequest)
        .subscribe({
          next: (response) => {
            console.log('User information saved successfully:', response);
            this.router.navigate(['/manager-view']);
          },
          error: (error) => {
            console.error('Error saving user information', error);
          },
        });
    }
  }
}
