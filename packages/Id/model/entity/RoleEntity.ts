import { BaseEntity } from '../base/BaseModels';

export interface RoleEntity extends BaseEntity<number> {
  name: string;
  desc: string;
  active: boolean;
}
