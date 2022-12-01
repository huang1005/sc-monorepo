import http, { genHandleFunc } from 'sc-http/fetch';
import type {
  AuthorizationRequest,
  TokenRequest,
  TokenResponse,
} from '@runafe/platform-oauth2';
import type { AxiosRequestConfig } from 'axios';

const PREFIX = '@@/idm-auth/oauth2@@'.replace(/@/g, '');

export function authorize<T extends AuthorizationRequest>(param: T) {
  return genHandleFunc(http.get<any>(`${PREFIX}/authorize`, param));
}

export const getToken = <T extends TokenRequest>(
  param: T,
  config?: AxiosRequestConfig
) => {
  return genHandleFunc(
    http.post<TokenResponse>(`${PREFIX}/token`, param, config)
  );
};
