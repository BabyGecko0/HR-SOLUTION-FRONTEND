import { BaseEntity } from './base-entity';
import { UserRole } from './user-role';

export class User extends BaseEntity {
  firstName!: string;
  lastName!: string;
  username!: string;
  password!: string;
  role!: UserRole;
  daysOff!: number;
}
