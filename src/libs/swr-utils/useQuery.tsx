import useSWR from 'swr'
import { stringify } from 'qs'
import { useAuthValue } from '../../atoms/authState'

// api
import { fetcherResult } from '../../api/fetcher'

// utils
import { isEmpty, isFunction, isObject, isString, isUndefined } from '../utils/assertion'

import type { SWRConfiguration } from 'swr'
import type { IStringifyOptions } from 'qs'

export const baseStringifyConfig: IStringifyOptions = {
  skipNulls: true,
  addQueryPrefix: true,
  arrayFormat: 'indices',
}

export interface QueryParserOptions {
  qs?: Record<string, any> | string
}

export const baseQueryParserConfig: QueryParserOptions = {}

export interface GuardOptions {
  checkLogin: boolean // 로그인 여부 체크
}

export const baseGuardConfig: GuardOptions = {
  checkLogin: false,
}

export interface Options extends SWRConfiguration {
  guard?: Partial<GuardOptions>
  queryParserOptions?: QueryParserOptions
  stringifyOptions?: IStringifyOptions
}

export const validatingQueryString = ({
  fullUrl,
  parserOptions,
  stirngifyOptions,
}: {
  fullUrl: string
  parserOptions: QueryParserOptions
  stirngifyOptions: IStringifyOptions
}) => {
  // check url 객체안에 query 값이 있는지 확인
  if (fullUrl.includes('?')) {
    // query 값이 있는 경우 const query = url.search.slice(1);
    // query 값을 가지고 있는 url 객체를 반환
    return fullUrl
  }

  const { qs } = parserOptions
  // query string 값이 없으면 url을 그래도 리턴
  if (isEmpty(qs)) return fullUrl

  // 존재하면 qs값이 string인지 객체인제 체크한다.
  if (isString(qs)) {
    // qs를 가지고 있는지 체크
    const hasPrefix = qs.startsWith('?')
    // qs값이 string인 경우
    // qs값을 가지고 있는 url 객체를 반환
    return `${fullUrl}${hasPrefix ? qs : `?${qs}`}`
  } else if (isObject(qs)) {
    const qsString = stringify(qs, stirngifyOptions)
    const hasPrefix = qsString.startsWith('?')
    // qs값이 object인 경우
    // qs값을 가지고 있는 url 객체를 반환
    return `${fullUrl}${hasPrefix ? qsString : `?${qsString}`}`
  }

  return fullUrl
}

export function useQuery<Data = any, Error = any>(key: string | (() => string | null) | null, options?: Options) {
  const { stringifyOptions, queryParserOptions, guard, fetcher, ...option } = options || {}
  const fetchFn = fetcher || fetcherResult

  const state = useAuthValue()

  const mergedStringifyOptions = {
    ...baseStringifyConfig,
    ...stringifyOptions,
  }

  const mergedQueryParserOptions = {
    ...baseQueryParserConfig,
    ...queryParserOptions,
  }

  const mergedGuardConfig = {
    ...baseGuardConfig,
    ...guard,
  }

  const swrKeyLoader = () => {
    const url: string | null = isFunction(key) ? key() : key
    if (!url) return null

    // 로그인 체크를 할지 여부
    if (mergedGuardConfig.checkLogin) {
      // 로그인을 안한 경우
      if (!state.isLoggedIn) return null
    }

    return validatingQueryString({
      fullUrl: url,
      parserOptions: mergedQueryParserOptions,
      stirngifyOptions: mergedStringifyOptions,
    })
  }

  const result = useSWR<Data, Error>(swrKeyLoader, fetchFn, {
    ...option,
  })

  const isLoading = isUndefined(result.data) && !result.error

  return {
    ...result,
    isLoading,
    currentKey: swrKeyLoader(),
  }
}
