import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { get, isObject, isArray, isRegExp, isEmptyObject } from '../helpers'
import type { AtLeast } from '../../ts'

export interface ICode {
  success: number | string
  fail: number | string
}

export type Config = AxiosRequestConfig & {
  _r_reverse?: boolean
  _r_interParam?: <T>(
    url: string,
    dataIn: T,
    reverse?: boolean
  ) => { url: string; data: Partial<T> }
}

export interface ICodeHandler {
  on?: RegExp | number[]
  handler: (back: {
    code: number | string
    error: AxiosError
    ins: AxiosInstance | AxiosInstance[]
    back: Promise<SysError>
  }) => any
}
// error response
export interface SysError {
  error: AxiosError
  isSysError?: boolean
  [index: string]: boolean | AxiosError | undefined
}

export interface IHttpConfig {
  instance: AxiosInstance
  code: ICode
  autoSetting: boolean
  errorFlag: string
  codeHandler: ICodeHandler[]
  request(config: AxiosRequestConfig, ins: SetupAxios): AxiosRequestConfig
  response(res: AxiosResponse, ins: SetupAxios): AxiosResponse
  transIns(ins: AxiosInstance): AxiosInstance
}

export type fetchFunc<T = object, K = any> = (
  data?: T,
  reserve?: boolean,
  others?: object
) => Promise<AxiosResponse<K> | SysError>

export type IRestResult = Record<string, fetchFunc>

export type BatchBackType<T> = Promise<AxiosResponse<T> | SysError>

export class SetupAxios {
  private configComputed: AtLeast<IHttpConfig, 'autoSetting' | 'errorFlag' | 'instance'>
  private instance: AxiosInstance

  // 默认配置
  private deConfig = {
    autoSetting: true,
    errorFlag: 'isSysError'
  }

  constructor(config: AtLeast<IHttpConfig, 'instance'>) {
    this.configComputed = {
      ...this.deConfig,
      ...config
    }
    this.instance = this.configComputed.instance
    this.init()
  }

  init() {
    this.handleInstance(this.instance)
    if (this.configComputed.autoSetting === true) {
      this.setConfig()
    }
  }

  isSysError(x: any): x is SysError {
    return x[this.configComputed.errorFlag] === true
  }

  getInstance() {
    return this.instance
  }

  setConfig() {
    if (this.configComputed.transIns) {
      this.configComputed.transIns(this.instance)
    }
  }

  handleInstance(instance: AxiosInstance) {
    instance.interceptors.request.use(this.preRequest.bind(this), this.catchError.bind(this))
    instance.interceptors.response.use(this.handleResponse.bind(this), this.catchError.bind(this))
  }

  preRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    if (this.configComputed.request) {
      config = this.configComputed.request(config, this)
    }
    return config
  }

  handleResponse(result: AxiosResponse): AxiosResponse {
    if (this.configComputed.response) {
      result = this.configComputed.response(result, this)
    }
    return result
  }

  catchError(error: AxiosError): Promise<SysError> {
    const code: number = get(error, 'response.status')
    const {
      errorFlag,
      codeHandler = [
        {
          handler: ({ back }) => back
        }
      ]
    } = this.configComputed

    const backPromise = Promise.resolve({
      [errorFlag]: true,
      error
    })

    for (let i = 0; i < codeHandler.length; i++) {
      const { on, handler } = codeHandler[i]
      if (
        !on ||
        (isArray<number>(on) && on.includes(code)) ||
        (isRegExp(on) && on.test(String(code)))
      ) {
        return handler({
          code,
          error,
          ins: this.instance,
          back: backPromise
        })
      }
    }

    // avoid try catch
    return backPromise
  }

  isError(x: any): x is SysError {
    return x[this.configComputed.errorFlag] === true
  }

  useParamInject<RequestParam = any>(urlIn, paramsIn: RequestParam, config?: Config) {
    if (paramsIn && !isEmptyObject(paramsIn)) {
      const { _r_interParam = SetupAxios.interParam } = config || {}
      const re = _r_interParam(urlIn, paramsIn, config?._r_reverse)
      return re
    }
    return false
  }

  normalizeRequest<R = any>(
    urlIn,
    paramsIn?: R,
    config?: Config
  ): {
    url: string
    data: Partial<R>
  } {
    let url = urlIn
    let data: Partial<R> = paramsIn || {}
    const result = this.useParamInject(urlIn, paramsIn, config)
    if (result) {
      url = result.url
      data = result.data!
    }

    return {
      url,
      data
    }
  }

  get<Result = any, RequestParam = any>(urlIn, paramsIn?: RequestParam, config?: Config) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config)
    return this.instance.get<Result>(url, {
      params: data,
      ...config
    }) as unknown as BatchBackType<Result>
  }

  delete<Result = any, RequestParam = any>(urlIn, paramsIn: RequestParam, config?: Config) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config)
    return this.instance.delete<Result>(url, {
      params: data,
      ...config
    }) as unknown as BatchBackType<Result>
  }

  post<Result = any, RequestParam = any>(urlIn, paramsIn: RequestParam, config?: Config) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config)
    return this.instance.post<Result>(url, data, {
      ...config
    }) as unknown as BatchBackType<Result>
  }

  put<Result = any, RequestParam = any>(urlIn, paramsIn: RequestParam, config?: Config) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config)
    return this.instance.put<Result>(url, data, {
      ...config
    })
  }

  patch<Result = any, RequestParam = any>(urlIn, paramsIn: RequestParam, config?: Config) {
    const { url, data } = this.normalizeRequest(urlIn, paramsIn, config)
    return this.instance.patch<Result>(url, data, {
      ...config
    })
  }

  // 解析 path 中的参数选项
  static interParam = function <T, K extends keyof T>(urlIn: string, dataIn: T, reserve = false) {
    let url = urlIn
    // 有传值是数组的情况
    const data = isObject(dataIn) ? { ...dataIn } : dataIn
    const matchs = url.match(/{([^/.]+)}/g)
    if (matchs?.length) {
      matchs.forEach((param) => {
        const key: K = param.replace(/[{}]/gi, '') as K
        url = url.replace(param, String(data[key]))
        if (!reserve) {
          delete data[key]
        }
      })
    }
    return { url, data }
  }
}
