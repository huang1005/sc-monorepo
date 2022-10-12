// axios实例的类型为AxiosInstance，响应的数据类型为AxiosResponse，请求需要传入的参数类型为AxiosRequestConfig
import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'

interface Hdata<T> {
  data: T
  resultCode: number
  message: string
}

interface InterceptorHooks {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (response: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}

interface InHttpConfig {
  instance: AxiosInstance
  interceptorHooks?: InterceptorHooks
}

export class InHttp {
  private config: InHttpConfig
  private instance: AxiosInstance
  constructor(config: InHttpConfig) {
    this.config = config
    this.instance = this.config.instance
    this.setupInterceptor()
  }

  setupInterceptor(): void {
    this.instance.interceptors.request.use(
      this.config.interceptorHooks?.requestInterceptor,
      this.config.interceptorHooks?.requestInterceptorCatch,
    )
    this.instance.interceptors.response.use(
      this.config.interceptorHooks?.responseInterceptor,
      this.config.interceptorHooks?.responseInterceptorCatch,
    )
  }

  request<T = any>(config: AxiosRequestConfig): Promise<Hdata<T>> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, Hdata<T>>(config)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: AxiosRequestConfig): Promise<Hdata<T>> {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<Hdata<T>> {
    return this.request({ ...config, method: 'POST' })
  }
}
