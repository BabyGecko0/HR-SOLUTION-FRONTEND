import { Status } from './status';

export class GetTimesheetResponse {
  fromDate: Date;
  toDate: Date;
  note: string;
  status: Status;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
  userDetails: UserDetails;

  constructor(
    fromDate: Date,
    toDate: Date,
    note: string,
    status: Status,
    createdAt: Date,
    createdBy: string,
    modifiedAt: Date,
    modifiedBy: string,
    userDetails: UserDetails
  ) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.note = note;
    this.status = status;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
    this.userDetails = userDetails;
  }
}

export class UserDetails {
  username: string;
  firstName: string;
  lastName: string;
  daysOff: number;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    daysOff: number
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.daysOff = daysOff;
  }
}
