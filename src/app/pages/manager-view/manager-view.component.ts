import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { EditTimesheetRequest } from 'src/app/models/edit-timesheet-request';
import { Status } from 'src/app/models/status';
import { TimesheetResponse } from 'src/app/models/timesheet-response';
import { CrudService } from 'src/app/services/crud-operations.service';

@Component({
  selector: 'app-manager-view',
  templateUrl: './manager-view.component.html',
  styleUrls: ['./manager-view.component.scss'],
})
export class ManagerViewComponent implements OnInit {
  userId!: string;
  timesheets!: any[];
  id = localStorage.getItem('USER_ID');
  searchUsername: string = '';
  filteredTimesheets: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';
  constructor(private crudService: CrudService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTimesheetsForManager();
  }

  @ViewChild('usersList', { static: false }) usersListRef!: ElementRef;

  loadTimesheets() {
    this.crudService.getAllTimesheets(this.userId).subscribe({
      next: (data) => {
        console.log(data);
        this.timesheets = data;
        this.filterTimesheets();
        this.displayTimesheets();
      },
      error: (error) => {
        console.error('Error fetching timesheets', error);
      },
      complete: () => {
        console.log('Completed fetching timesheets');
      },
    });
  }

  displayTimesheets() {
    const timesheetData = this.filteredTimesheets.map(
      (timesheet) => timesheet.timesheetData
    );
    this.usersListRef.nativeElement.innerHTML = '';

    timesheetData.forEach((timesheet) => {
      const li = document.createElement('li');
      li.textContent = JSON.stringify(timesheet);
      this.usersListRef.nativeElement.appendChild(li);
    });
  }

  fetchTimesheetsForManager() {
    if (this.id) {
      this.crudService.getAllTimesheets(this.id).subscribe({
        next: (response: any[]) => {
          this.timesheets = response
            .filter(
              (timesheet: { status: string }) => timesheet.status === 'PENDING'
            )
            .sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();

              return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });

          this.filterTimesheets();
        },
        error: (error) => {
          console.error('Error fetching timesheets', error);
        },
        complete: () => {
          console.log('Completed fetching timesheets');
        },
      });
    }
  }

  rejectTimesheet(timesheet: any) {
    const timesheetId = timesheet.id;
    const editTimesheetRequest = new EditTimesheetRequest(
      timesheet.userDetails.username,
      timesheet.userDetails.firstName,
      timesheet.userDetails.lastName,
      Status.Rejected
    );

    this.crudService
      .editTimesheetById(timesheetId, editTimesheetRequest)
      .subscribe({
        next: (response: TimesheetResponse) => {
          console.log('Timesheet rejected successfully');
        },
        error: (error) => {
          console.log('Error rejecting timesheet:', error);
        },
        complete: () => {
          console.log('Completed');
        },
      });
  }

  deleteTimesheet(timesheetId: string) {
    if (confirm('Are you sure you want to delete this timesheet?')) {
      this.crudService.deleteTimesheetById(timesheetId).subscribe({
        next: () => {
          console.log('Timesheet deleted successfully');
          this.fetchTimesheetsForManager();
        },
        error: (error) => {
          console.log('Error deleting timesheet:', error);
        },
        complete: () => {
          console.log('Completed');
        },
      });
    }
  }

  onContactClick(timesheetId: string) {
    this.router.navigate(['/edit-user', timesheetId]);
  }

  onSearchButtonClick(searchValue: string) {
    this.searchUsername = searchValue;
  }

  filterTimesheets() {
    this.filteredTimesheets = this.timesheets.filter((timesheet) =>
      timesheet.userDetails.username
        .toLowerCase()
        .includes(this.searchUsername.toLowerCase())
    );
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.fetchTimesheetsForManager();
  }
}
