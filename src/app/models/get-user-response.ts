import { Status } from './status';
import { UserRole } from './user-role';

export class GetUserResponse {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  daysOff: number;
  timesheetDetails: TimesheetDetails[];

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    role: UserRole,
    daysOff: number,
    timesheetDetails: TimesheetDetails[]
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role;
    this.daysOff = daysOff;
    this.timesheetDetails = timesheetDetails;
  }
}

export class TimesheetDetails {
  statusColor: any;
  id(id: string) {
    throw new Error('Method not implemented.');
  }

  fromDate: Date;
  toDate: Date;
  note: string;
  status: Status;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;

  constructor(
    fromDate: Date,
    toDate: Date,
    note: string,
    status: Status,
    createdAt: Date,
    createdBy: string,
    modifiedAt: Date,
    modifiedBy: string
  ) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.note = note;
    this.status = status;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.modifiedAt = modifiedAt;
    this.modifiedBy = modifiedBy;
  }
}
