import { BaseEntity } from '../base/BaseModels';

export interface PermissionEntity extends BaseEntity<number> {
  code: string;
  name: string;
  category: string;
}
