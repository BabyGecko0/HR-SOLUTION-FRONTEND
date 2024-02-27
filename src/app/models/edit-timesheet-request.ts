import { Status } from './status';

export class EditTimesheetRequest {
  username: string;
  firstName: string;
  lastName: string;
  status: Status;

  constructor(
    username: string,
    firstName: string,
    lastName: string,
    status: Status
  ) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.status = status;
  }
}
