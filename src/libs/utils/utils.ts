import axios from 'axios'
import multiavatar from '@multiavatar/multiavatar/esm'
import qs from 'qs'
import { isDesktop, isMobile, isTablet } from 'react-device-detect'

// constants
import { STORAGE_KEY } from '../../constants'

// utils
import { isElement } from 'lodash-es'

// types
import type { AxiosError } from 'axios'
import type { Schema } from '../../api/schema/common'
import type { MutableRefObject } from 'react'

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

export const isTouchscreenDevice = isDesktop || isTablet ? false : (isBrowser ? navigator.maxTouchPoints > 0 : false) || isMobile

export function getOwnerWindow(node?: Element | null): typeof globalThis {
  return isElement(node) ? getOwnerDocument(node)?.defaultView ?? window : window
}

export function getOwnerDocument(node?: Element | null): Document {
  return isElement(node) ? node?.ownerDocument ?? document : document
}

export function isAxiosError<R = any>(error: any): error is AxiosError<Schema<R>> {
  return error && axios.isAxiosError(error)
}

export const generateKey = () => {
  return Math.random().toString(36).substr(2, 11)
}

export const generateAvatar = (avatarKey: string) => {
  return multiavatar(avatarKey)
}

interface GetThumbnail {
  defaultProfile?: boolean
  avatarSvg?: string | null
  profileUrl?: string | null
  name?: string
}

export const getThumbnail = (params?: GetThumbnail) => {
  const { defaultProfile = true, avatarSvg = null, profileUrl = null, name = 'null' } = params || {}
  const svgCode = `data:image/svg+xml;utf8,${encodeURIComponent(generateAvatar(avatarSvg ?? name))}`
  return defaultProfile ? svgCode : profileUrl ?? svgCode
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

type TargetValue<T> = T | undefined | null

type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element> = (() => TargetValue<T>) | TargetValue<T> | MutableRefObject<TargetValue<T>>

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!isBrowser) {
    return undefined
  }

  if (!target) {
    return defaultElement
  }

  let targetElement: TargetValue<T>

  if (typeof target === 'function') {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}
