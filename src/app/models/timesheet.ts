import { BaseEntity } from './base-entity';
import { Status } from './status';

export class Timesheet extends BaseEntity {
  userId!: string;
  fromDate!: Date;
  toDate!: Date;
  status!: Status;
  note!: string;
}
