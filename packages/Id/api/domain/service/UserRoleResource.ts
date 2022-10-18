import { Handler } from 'sc-http';
import { UserRoleEntity } from '@ld/model';
import { DomainResource } from './DomainResource';
import * as Criterias from '../query/RCriterias';

class UserRoleSetResource extends DomainResource<number, UserRoleEntity> {
  constructor() {
    super('IDM-User_Role-Entity');
  }

  /**
   * 批量分配角色
   * @param userIds 给这些用户分配
   * @param roleIds 分配这些角色
   * @param handler 异步处理器
   */
  batchAssign(userIds: number[], roleIds: number[], handler?: Handler) {
    const userRoles: UserRoleEntity[] = [];

    userIds.forEach(userId => {
      roleIds.forEach(roleId => {
        userRoles.push({
          userId,
          roleId,
        });
      });
    });

    super.merge(
      {
        items: userRoles,
        range: Criterias.must(Criterias.inValues('userId', userIds)),
      },
      handler
    );
  }
}

// 用户角色管理
export const userRoleSetResource: UserRoleSetResource =
  new UserRoleSetResource();
