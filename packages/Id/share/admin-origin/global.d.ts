export interface Fn<T = any> {
  (...arg: T[]): T;
}

export type Nullable<T> = T | null;

export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

export type ElememtPlusSize = 'default' | 'small' | 'large';

export type ElementPlusInfoType = 'success' | 'info' | 'warning' | 'danger';

export type Recordable<T = any, K = string> = Record<
  K extends null | undefined ? string : K,
  T
>;

export type ComponentRef<T> = InstanceType<T>;

export type LocaleType = 'zh-CN' | 'en';

export type AxiosHeaders =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data';

export type AxiosMethod = 'get' | 'post' | 'delete' | 'put';

export type AxiosResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export type AxiosConfig = {
  params?: any;
  data?: any;
  url?: string;
  method?: AxiosMethod;
  headersType?: string;
  responseType?: AxiosResponseType;
};
