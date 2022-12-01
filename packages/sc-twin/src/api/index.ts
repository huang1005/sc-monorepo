import { InHttp } from '@runafe/sc-http'
import axios from 'axios'
import qs from 'qs'
const instance = axios.create({
  baseURL: 'http://192.168.1.65/v4.0/digit-twin',
  timeout: 6000
})
export const insHttp = new InHttp({
  instance,
  interceptorHooks: {
    requestInterceptor(config) {
      const token = '4154fe0c-1b9c-490a-9aaa-cf09324eea32'
      config.headers!['Authorization'] = 'Bearer ' + token
      if (config.method === 'get') {
        config.paramsSerializer = {
          encode: (params: any): string => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        }
      }
      return config
    },
    requestInterceptorCatch(error) {
      return Promise.reject(error)
    },
    responseInterceptor(response) {
      return response.data
    },
    responseInterceptorCatch(error) {
      return Promise.reject(error)
    }
  }
})
