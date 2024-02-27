import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, pipe, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { User } from '../models/user';
import { TimesheetRequest } from '../models/timesheet-request';
import { TimesheetResponse } from '../models/timesheet-response';
import { EditTimesheetRequest } from '../models/edit-timesheet-request';
import { GetUserResponse, TimesheetDetails } from '../models/get-user-response';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  urlUser = 'http://localhost:8082/api/user';
  urlTimesheet = 'http://localhost:8082/api/timesheet';

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<GetUserResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<GetUserResponse>(`${this.urlUser}/${userId}`, {
      headers: headers,
    });
  }

  createUserBySignUp(user: User): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post(`${this.urlUser}/signUp`, user, { headers: headers })
      .pipe(
        map((response: any) => response as Array<any>),
        map((response: Array<any>) => response[0])
      );
  }

  getUserLogin(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.urlUser}/login?username=${username}&password=${password}`,
      { headers: headers }
    );
  }

  getAllTimesheets(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.urlTimesheet}/all/${userId}`, {
      headers: headers,
    });
  }

  deleteUserById(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.urlUser}/${userId}`, { headers: headers });
  }

  getTimesheetById(timesheetId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get(`${this.urlTimesheet}/${timesheetId}`, {
      headers: headers,
    });
  }

  createTimesheet(
    userId: string,
    timesheetRequest: TimesheetRequest
  ): Observable<TimesheetResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<TimesheetResponse>(
      `${this.urlTimesheet}/create/${userId}`,
      timesheetRequest,
      { headers: headers }
    );
  }

  deleteTimesheetById(timesheetId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.urlTimesheet}/delete/${timesheetId}`, {
      headers: headers,
    });
  }

  editTimesheetById(
    timesheetId: string,
    editTimesheetRequest: EditTimesheetRequest
  ): Observable<TimesheetResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<TimesheetResponse>(
      `${this.urlTimesheet}/edit/${timesheetId}`,
      editTimesheetRequest,
      { headers: headers }
    );
  }
}
