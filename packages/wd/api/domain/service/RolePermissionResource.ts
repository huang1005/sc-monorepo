import { Handler } from 'sc-http';
import type { RolePermissionEntity } from '@wd/model';
import { DomainResource } from './DomainResource';
import * as Criterias from '../query/RCriterias';

class RolePermissionSetResource extends DomainResource<
  number,
  RolePermissionEntity
> {
  constructor() {
    super('IDM-Role_Permission-Entity');
  }

  /**
   * 批量分配权限
   * @param roleIds 给这些角色分配
   * @param permissionCodes 分配这些权限
   * @param handler 异步处理器
   */
  batchAssign(roleIds: number[], permissionCodes: string[], handler?: Handler) {
    const rolePermissions: RolePermissionEntity[] = [];

    roleIds.forEach(roleId => {
      permissionCodes.forEach(permissionCode => {
        rolePermissions.push({
          roleId,
          permissionCode,
        });
      });
    });

    super.merge(
      {
        items: rolePermissions,
        range: Criterias.must(Criterias.inValues('roleId', roleIds)),
      },
      handler
    );
  }
}

// 角色权限管理
export const rolePermissionSetResource: RolePermissionSetResource =
  new RolePermissionSetResource();
