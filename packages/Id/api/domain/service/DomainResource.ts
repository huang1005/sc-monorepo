import { BaseEntity } from '@ld/model';
import { insHttp as http, Handler, handleResult, Response } from 'sc-http';
import { RQuery } from '../query/RQuery';
import { UpdateItem, UpdateItems, MergeItems } from '../update/UpdateItems';
// import Qs from 'qs';
import type {
  RoleEntity,
  UserEntity,
  UserRoleEntity,
  RolePermissionEntity,
  PermissionEntity,
  OrganizationEntity,
} from '@ld/model';

const PREFIX = '@@/data-domain/eo@@'.replace(/@/g, '');

export class DomainResource<K, E extends BaseEntity<K>> {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  /**
   * 新增实体信息, 根据传入的对象值新增一条记录
   * @param data 数据对象
   * @param handler 异步处理器
   */
  add(data: E, handler?: Handler) {
    return http.post<Response<E>>(`${PREFIX}/${this.path}`, data).then(res => {
      handleResult(res, handler);
    });
  }

  /**
   * 删除实体信息，根据主键删除一条记录
   * @param id 实体主键
   * @param handler 异步处理器
   */
  delete(id: K, handler?: Handler) {
    return http
      .delete<Response<number>>(`${PREFIX}/${this.path}/${id}`, {})
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 变更实体信息, 根据传入的对象ID，覆盖相同ID对象所有属性值
   * @param data 数据对象
   * @param handler 异步处理器
   */
  update(data: E, handler?: Handler) {
    return http.put<Response<E>>(`${PREFIX}/${this.path}`, data).then(res => {
      handleResult(res, handler);
    });
  }

  /**
   * 按属性变更实体信息", 根据传入的对象修改指定的字段值
   * @param updateItem 数据对象
   * @param handler 异步处理器
   */
  modify(updateItem: UpdateItem<E>, handler?: Handler) {
    return http
      .patch<Response<E>>(`${PREFIX}/${this.path}`, updateItem)
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 获取单个实体信息，根据主键查询一条记录
   * @param id 数据对象ID
   * @param handler 异步处理器
   */
  getItemById(id: K, handler?: Handler) {
    return http
      .get<Response<E>>(`${PREFIX}/${this.path}/${id}`, {})
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 获取实体信息默认值
   * @param handler 异步处理器
   */
  defaultValue(handler?: Handler) {
    return http
      .get<Response<E>>(`${PREFIX}/${this.path}/defaultValue`, {})
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 批量新增实体信息, 根据传入的对象集合新增多条记录
   * @param items 数据对象
   * @param handler 异步处理器
   */
  addItems(items: E[], handler?: Handler) {
    return http
      .post<Response<E[]>>(`${PREFIX}/${this.path}`, items)
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 批量删除实体信息, 根据实体ID集合删除多条记录
   * @param itemIds 数据对象
   * @param handler 异步处理器
   */
  deleteByIds(itemIds: K[], handler?: Handler) {
    return http
      .delete<Response<number>>(`${PREFIX}/${this.path}/batch`, itemIds)
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 批量变更实体信息，根据传入的对象集合修改多条记录（全属性变更）
   * @param items 数据对象
   * @param handler 异步处理器
   */
  updateItems(items: E[], handler?: Handler) {
    return http
      .put<Response<E[]>>(`${PREFIX}/${this.path}`, items)
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 批量变更实体信息，根据传入的对象集合修改多条记录（全属性变更）
   * @param items 数据对象
   * @param handler 异步处理器
   */
  modifyItems(items: UpdateItems<E>, handler?: Handler) {
    return http
      .patch<Response<E[]>>(`${PREFIX}/${this.path}`, items)
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 将数据对象列表按条件合并到数据库
   * @param items 合并参数
   * @param handler 异步处理器
   */
  merge(items: MergeItems<E>, handler?: Handler) {
    return http
      .patch<Response<E[]>>(`${PREFIX}/${this.path}/merge`, items)
      .then(res => {
        handleResult(res, handler);
      });
  }

  /**
   * 高级查询
   * @param query 查询、排序、分页条件
   * @param handler 异步处理器
   */
  advancedSearch(
    query: RQuery,
    handler?: Handler<Response<Array<E>>, Array<E>>
  ) {
    return http
      .post<Response<Array<E>>>(`${PREFIX}/${this.path}/search-advanced`, query)
      .then(res => {
        handleResult(res, handler);
      });
  }
}

// 用户管理
export const userResource: DomainResource<number, UserEntity> =
  new DomainResource<number, UserEntity>('IDM-User-Entity');
// 用户角色管理
export const userRoleResource: DomainResource<number, UserRoleEntity> =
  new DomainResource<number, UserRoleEntity>('IDM-User_Role-Entity');
// 角色管理
export const roleResource: DomainResource<number, RoleEntity> =
  new DomainResource<number, RoleEntity>('IDM-Role-Entity');
// 角色权限管理
export const rolePermissionResource: DomainResource<
  number,
  RolePermissionEntity
> = new DomainResource<number, RolePermissionEntity>(
  'IDM-Role_Permission-Entity'
);
// 权限管理
export const permissionResource: DomainResource<number, PermissionEntity> =
  new DomainResource<number, PermissionEntity>('IDM-Permission-Entity');
// 组织机构部门管理
export const organizationResource: DomainResource<number, OrganizationEntity> =
  new DomainResource<number, OrganizationEntity>('IDM-Organization-Entity');
