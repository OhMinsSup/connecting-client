import { client } from './client'
import omit from 'lodash-es/omit'

import type { Params, Schema } from './schema/common'
import type { AxiosRequestConfig } from 'axios'

const STORAGE_KEY = {
  TOKEN_KEY: '',
}

class APIMoudle {
  withCredentials: boolean
  constructor() {
    this.withCredentials = true
  }

  setWithCredentials(withCredentials: boolean) {
    this.withCredentials = withCredentials
  }

  authorized = () => {
    if (typeof window === 'undefined') return null
    const authorization = localStorage.getItem(STORAGE_KEY.TOKEN_KEY)
    if (!authorization) return null
    return authorization
  }

  baseConfig = (config: AxiosRequestConfig | undefined) => {
    const authorization = this.authorized()
    return {
      ...(config && omit(config, ['headers'])),
      headers: {
        'Content-Type': 'application/json',
        ...([authorization, !this.withCredentials].every(Boolean) && {
          Authorization: `Bearer ${authorization}`,
        }),
        ...(config && config.headers),
      },
    }
  }

  put = <D = any>({ url, body = {}, config = {} }: Params) => {
    return client.put<Schema<D>>(url, body, this.baseConfig(config))
  }

  get = <D = any>({ url, config = undefined }: Params) => {
    return client.get<Schema<D>>(url, this.baseConfig(config))
  }

  delete = <D = any>({ url, config = undefined }: Params) => {
    return client.delete<Schema<D>>(url, this.baseConfig(config))
  }

  post = <D = any>({ url, body = {}, config = undefined }: Params) => {
    return client.post<Schema<D>>(url, body, this.baseConfig(config))
  }
}

export const api = new APIMoudle()
