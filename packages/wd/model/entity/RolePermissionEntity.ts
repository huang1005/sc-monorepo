import { BaseEntity } from '../base/BaseModels';

export interface RolePermissionEntity extends BaseEntity<number> {
  permissionCode: string;
  roleId: number;
}
