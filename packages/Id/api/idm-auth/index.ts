import http, { genHandleFunc } from 'sc-http/fetch';
import type { loginType } from '@ld/model';

const PREFIX = '@@/idm-auth@@'.replace(/@/g, '');

export interface LoginResult {
  code: number;
  success: boolean;
}

export const login = <T extends loginType>(param?: T) =>
  genHandleFunc(http.post<LoginResult>(`${PREFIX}/login`, param));
