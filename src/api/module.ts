import { client } from './client'
import type { Params, Schema } from './type'

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

  deleteResponse = async <D = any>({ url, headers = {} }: Params) => {
    const authorization = this.authorized()
    const result = await client.delete<Schema<D>>(url, {
      headers: {
        'Content-Type': 'application/json',
        ...([authorization, !this.withCredentials].every(Boolean) && {
          Authorization: `Bearer ${authorization}`,
        }),
        ...headers,
      },
    })
    return result
  }

  postResponse = async <D = any>({ url, body = {}, headers = {} }: Params) => {
    const authorization = this.authorized()
    const result = await client.post<Schema<D>>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...([authorization, !this.withCredentials].every(Boolean) && {
          Authorization: `Bearer ${authorization}`,
        }),
        ...headers,
      },
    })
    return result
  }

  putResponse = async <D = any>({ url, body = {}, headers = {} }: Params) => {
    const authorization = this.authorized()
    const result = await client.put<Schema<D>>(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...([authorization, !this.withCredentials].every(Boolean) && {
          Authorization: `Bearer ${authorization}`,
        }),
        ...headers,
      },
    })
    return result
  }

  getResponse = async <D = any>({ url, headers = {} }: Params) => {
    const authorization = this.authorized()
    const result = await client.get<Schema<D>>(url, {
      headers: {
        'Content-Type': 'application/json',
        ...([authorization, !this.withCredentials].every(Boolean) && {
          Authorization: `Bearer ${authorization}`,
        }),
        ...headers,
      },
    })
    return result
  }
}

export const api = new APIMoudle()
