import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BaseEntity } from './base-entity';

export class TimesheetRequest {
  fromDate: Date | null | undefined;
  toDate: Date | null | undefined;
  note: string | undefined;
  createdBy!: string;
}
