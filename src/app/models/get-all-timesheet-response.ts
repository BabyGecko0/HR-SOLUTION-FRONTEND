import { Status } from './status';
import { UserRole } from './user-role';

export class GetAllTimesheetResponse {
  id: string;
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
    id: string,
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
    this.id = id;
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
  password: string;
  role: UserRole;
  daysOff: number;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    role: UserRole,
    daysOff: number
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role;
    this.daysOff = daysOff;
  }
}
