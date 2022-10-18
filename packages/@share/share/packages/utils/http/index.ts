import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInterceptorOptions,
} from 'axios';
import {
  get,
  isObject,
  isArray,
  isRegExp,
  isEmptyObject,
  isDef,
} from '../helpers';
import type { AtLeast } from '../../ts';

export type Config = AxiosRequestConfig & {
  _r_reverse?: boolean;
  _r_interParam?: <T>(
    url: string,
    dataIn: T,
    reverse?: boolean
  ) => { url: string; data: Partial<T> };
};

export interface ICodeHandler {
  on?: RegExp | number[];
  handler: (back: {
    code: number | string;
    error: AxiosError;
    ins: AxiosInstance | AxiosInstance[];
    back: Promise<SysError>;
    rowBack: SysError;
  }) => any;
}
// error response
export interface SysError<T = any> {
  error: AxiosError<T>;
  isSysError?: boolean;
  hasHandled?: boolean;
  [index: string]: boolean | AxiosError | undefined;
}

export interface IHttpConfig {
  instance: AxiosInstance;
  autoSetting: boolean;
  errorFlag: string;
  codeHandler: ICodeHandler[];
  request(config: AxiosRequestConfig, ins: SetupAxios): AxiosRequestConfig;
  requestInterceptorOptions?(ins: SetupAxios): AxiosInterceptorOptions;
  response(res: AxiosResponse, ins: SetupAxios): AxiosResponse;
  transIns(ins: AxiosInstance, setUpIns: SetupAxios): void;
}

export type fetchFunc<T = object, K = any> = (
  data?: T,
  reserve?: boolean,
  others?: object
) => Promise<AxiosResponse<K> | SysError>;

export type IRestResult = Record<string, fetchFunc>;
export type BatchRowBackType<T> = AxiosResponse<T> | SysError;
export type BatchBackType<T> = Promise<BatchRowBackType<T>>;
export type SetupAxiosIns = InstanceType<typeof SetupAxios>;
export type DynamicRequestConfigFn<T = any> = (
  config: AxiosRequestConfig<T>
) => void;
export class SetupAxios {
  private config: AtLeast<
    IHttpConfig,
    'autoSetting' | 'errorFlag' | 'instance'
  >;
  private instance: AxiosInstance;
  private dynamicRequestConfig: Map<string, DynamicRequestConfigFn> = new Map();

  // 默认配置
  private defaultConfig = {
    autoSetting: true,
    errorFlag: 'isSysError',
  };

  constructor(config: AtLeast<IHttpConfig, 'instance'>) {
    this.config = {
      ...this.defaultConfig,
      ...config,
    };
    this.instance = this.config.instance;
    this.init();
  }

  init() {
    this.handleInstance(this.instance);
    if (this.config.autoSetting === true) {
      this.setConfig();
    }
  }

  registerDynamicRequestConfig<T = any>(
    name: string,
    fn: DynamicRequestConfigFn<T>
  ) {
    if (isDef(name)) {
      this.dynamicRequestConfig.set(name, fn);
    }
  }

  getDynamicRequestConfig(name) {
    if (!isDef(name)) {
      console.error(
        `can not find dynamicRequestConfig by empty name [${name}]`
      );
      return null;
    }
    return this.dynamicRequestConfig.get(name);
  }

  removeDynamicRequestConfig(name: string) {
    this.dynamicRequestConfig.delete(name);
  }

  isSysError(x: any): x is SysError {
    return x[this.config.errorFlag] === true;
  }

  getInstance() {
    return this.instance;
  }

  setConfig() {
    if (this.config.transIns) {
      this.config.transIns(this.instance, this);
    }
  }

  handleInstance(instance: AxiosInstance) {
    instance.interceptors.request.use(
      this.preRequest,
      this.catchError.bind(this),
      this.requestInterceptor
    );
    instance.interceptors.response.use(
      this.handleResponse,
      this.catchError.bind(this)
    );
  }

  get preRequest() {
    return (config: AxiosRequestConfig) => {
      if (this.config.request) {
        config = this.config.request(config, this);
      }
      return config;
    };
  }

  // AxiosInterceptorOptions{}
  get requestInterceptor() {
    if (this.config.requestInterceptorOptions) {
      const { requestInterceptorOptions } = this.config;
      return requestInterceptorOptions(this);
    }
    return undefined;
  }

  get handleResponse() {
    return (result: AxiosResponse) => {
      if (this.config.response) {
        result = this.config.response(result, this);
      }
      return result;
    };
  }

  catchError(error: AxiosError): Promise<SysError> {
    const code: number = get(error, 'response.status');
    const {
      errorFlag,
      codeHandler = [
        {
          handler: ({ back }) => back,
        },
      ],
    } = this.config;

    // not use Promise.reject, because I do not want to try catch.
    const back = {
      [errorFlag]: true,
      error,
    };

    for (let i = 0; i < codeHandler.length; i++) {
      const { on, handler } = codeHandler[i];
      if (
        !on ||
        (isArray<number>(on) && on.includes(code)) ||
        (isRegExp(on) && on.test(String(code)))
      ) {
        if (isRegExp(on)) {
          on.lastIndex = 0;
        }
        return handler({
          code,
          error,
          ins: this.instance,
          back: Promise.resolve({ ...back, hasHandled: true }),
          rowBack: { ...back },
        });
      }
    }

    // avoid try catch
    return Promise.resolve(back);
  }

  isError(x: any): x is SysError {
    return x[this.config.errorFlag] === true;
  }

  useParamInject<RequestParam = any>(
    urlIn,
    paramsIn: RequestParam,
    config?: Config
  ) {
    if (paramsIn && !isEmptyObject(paramsIn)) {
      const { _r_interParam = SetupAxios.interParam } = config || {};
      const re = _r_interParam(urlIn, paramsIn, config?._r_reverse);
      return re;
    }
    return false;
  }

  normalizeRequest<R = any>(
    urlIn,
    paramsIn?: R,
    config?: Config
  ): {
    url: string;
    data: Partial<R>;
  } {
    let url = urlIn;
    let data: Partial<R> = paramsIn || {};
    const result = this.useParamInject(urlIn, paramsIn, config);
    if (result) {
      url = result.url;
      data = result.data!;
    }

    return {
      url,
      data,
    };
  }

  get<Result = any, RequestParam = any>(
    urlIn,
    paramsIn?: RequestParam,
    config?: Config
  ) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config);
    return this.instance.get<Result>(url, {
      params: data,
      ...config,
    }) as unknown as BatchBackType<Result>;
  }

  delete<Result = any, RequestParam = any>(
    urlIn,
    paramsIn: RequestParam,
    config?: Config
  ) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config);
    return this.instance.delete<Result>(url, {
      data,
      ...config,
    }) as unknown as BatchBackType<Result>;
  }

  post<Result = any, RequestParam = any>(
    urlIn,
    paramsIn: RequestParam,
    config?: Config
  ) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config);
    return this.instance.post<Result>(url, data, {
      ...config,
    }) as unknown as BatchBackType<Result>;
  }

  put<Result = any, RequestParam = any>(
    urlIn,
    paramsIn: RequestParam,
    config?: Config
  ) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config);
    return this.instance.put<Result>(url, data, {
      ...config,
    });
  }

  patch<Result = any, RequestParam = any>(
    urlIn,
    paramsIn: RequestParam,
    config?: Config
  ) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config);
    return this.instance.patch<Result>(url, data, {
      ...config,
    });
  }

  // 解析 path 中的参数选项
  static interParam = function <T, K extends keyof T>(
    urlIn: string,
    dataIn: T,
    reserve = false
  ) {
    let url = urlIn;
    // 有传值是数组的情况
    const data = isObject(dataIn) ? { ...dataIn } : dataIn;
    const matchs = url.match(/{([^/.]+)}/g);
    if (matchs?.length) {
      matchs.forEach(param => {
        const key: K = param.replace(/[{}]/gi, '') as K;
        url = url.replace(param, String(data[key]));
        if (!reserve) {
          delete data[key];
        }
      });
    }
    return { url, data };
  };
}
