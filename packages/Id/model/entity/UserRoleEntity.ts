import { BaseEntity } from '../base/BaseModels';

export interface UserRoleEntity extends BaseEntity<number> {
  roleId: number;
  userId: number;
}
