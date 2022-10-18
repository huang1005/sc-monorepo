/**
 * 用以定义用户管理相关 非构建接口的其它接口
 */

import http, {
  handleResult,
  type Handler,
  type Response,
  genHandleFunc,
} from 'sc-http/fetch';
import type { UserEntity, BaseEntity } from '@ld/model';

const PREFIX = '@@/idm-auth@@'.replace(/@/g, '');

export function getUserList<T extends BaseEntity<number>>(
  param: T,
  handler?: Handler
) {
  return http
    .post<Response<UserEntity[] | null>>(`${PREFIX}/user/list`, param)
    .then(res => {
      handleResult(res, handler);
    });
}

export function getByToken() {
  return genHandleFunc(
    http.get<Response<UserEntity | null>>(`${PREFIX}/user/getByToken`)
  );
}
