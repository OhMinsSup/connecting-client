import axios from 'axios'
import qs from 'qs'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'

import type { AxiosError } from 'axios'
import type { Schema } from '../../api/schema/common'
import { STORAGE_KEY } from '../../constants'

export const isTouchscreenDevice = isDesktop || isTablet ? false : (typeof window !== 'undefined' ? navigator.maxTouchPoints > 0 : false) || isMobile

export const makeQueryString = (params: any) => {
  const stringify = qs.stringify(params, {
    arrayFormat: 'comma',
    skipNulls: true,
    addQueryPrefix: true,
  })
  return stringify
}

export function canUseDOM(): boolean {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement)
}

export const isBrowser = canUseDOM()

export function isAxiosError<R = any>(error: any): error is AxiosError<Schema<R>> {
  return error && axios.isAxiosError(error)
}

export const generateKey = () => {
  return Math.random().toString(36).substr(2, 11)
}

export const getToken = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEY.TOKEN_KEY)
    if (!token) return ''
    return token
  } catch (error) {
    return ''
  }
}
