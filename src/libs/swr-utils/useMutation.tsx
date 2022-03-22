import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'

// error
import { ApiError } from '../error'

// utils
import { isFunction, isString } from '../utils'

// constants
import { STATUS_CODE } from '../../constants'

// types
import type { Api, Schema } from '../../api/schema/common'

type Fn = (...args: any[]) => Promise<Api>

interface Mutation<R> {
  ok: boolean
  data: Schema<R> | null
  message?: string | null
}

interface Options<R = any> {
  invalidateKey?: string | ((data: Schema<R>) => string) // 요청이 성공하고 데이터를 invalidate를 할 때 사용
  deleteKey?: string // 요청이 성공하고 데이터를 삭제할 때 사용
  onSuccess?: (data: Schema<R>) => any // 요청이 성공 후 호출하는 함수
  onError?: (error: Mutation<R>) => any // 요청 후 에러가 발생하면 호출하는 함수
}

/**
 * @example
 * const { mutateAync, loading, data } = useMutation(API_FUNC, {
 *   invalidateKey: (data) => 'API_END_POINT' || 'API_END_POINT', // 요청이 성공하고 데이터를 invalidate를 할 때 사용 함수로 값을 받을 경우 첫번째 파라미터에 성공한 데이터가 넘어오게 된다. (default: undefined)
 *   deleteKey: 'API_END_POINT', // 해당 키가 존재하면 요청 성공시 삭제한다. (default: undefined)
 *   onSuccess: (data) => {}, // 요청이 성공 후 호출하는 함수 그리고 첫번째 파라미터에 성공한 데이터가 넘어오게 된다. (default: undefined)
 *   onError: (error) => {}, // 요청 후 에러가 발생하면 호출하는 함수 그리고 첫번째 파라미터에 실패한 에러 객체가 넘어오게 된다. (default: undefined)
 * });
 *
 * mutateAync: API 요청
 * loading: API 요청 중 상태
 * data: API 요청 성공 시 반환 데이터 (해당 데이터는 요청 성공 시 state로 데이터를 받기 위해서 사용. 요청 실패 시 null)
 */
export function useMutation<T>(fn: Fn, options?: Options<T> | undefined) {
  const { cache, mutate } = useSWRConfig()

  const [data, setState] = useState<Schema<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Mutation<T> | null>(null)

  // 요청이 성공 후 deleteKey에 해당하는 데이터 삭제
  const onDeleteKey = () => {
    if (options?.deleteKey && isString(options.deleteKey)) {
      if (cache.get(options.deleteKey)) cache.delete(options.deleteKey)
    }
  }

  const onInvalidateKey = async (data: Schema<T>) => {
    // 성공시 데이터 패칭
    if (options?.invalidateKey) {
      if (isString(options.invalidateKey) || isFunction(options.invalidateKey)) {
        const key = isFunction(options.invalidateKey) ? options.invalidateKey(data) : options.invalidateKey
        await mutate(key)
      }
    }
  }

  const onSuccess = async (data: Schema<T>) => {
    setState(data)
    // 성공시 콜백 호출
    if (isFunction(options?.onSuccess)) {
      if (options?.onSuccess instanceof Promise) {
        await options?.onSuccess(data)
      } else {
        options?.onSuccess(data)
      }
    }
  }

  const onError = async (e: Mutation<T>) => {
    setError(e)
    // 실패시 콜백 호출
    if (isFunction(options?.onError)) {
      if (options?.onError instanceof Promise) {
        await options?.onError(e)
      } else {
        options?.onError(e)
      }
    }
  }

  const mutateAsync = useCallback(
    async (...params: any[]): Promise<Mutation<T>> => {
      try {
        setState(null)
        setError(null)
        setLoading(true)
        const { data } = await fn(...params)
        setLoading(false)

        if (data.ok) {
          // 성공 시 캐시키 삭제
          onDeleteKey()

          // 성공시 데이터 패칭
          onInvalidateKey(data)

          // 성공시 콜백 호출
          onSuccess(data)

          return {
            ok: true,
            data,
            message: null,
          }
        }

        throw new ApiError(data)
      } catch (e) {
        setLoading(false)
        setState(null)

        const message: Mutation<T> = {
          ok: false,
          data: null,
          message: null,
        }

        // http status가 실패인 경우 서버 에러
        if (ApiError.isAxiosError(error)) {
          const { response } = error
          switch (response?.status) {
            case STATUS_CODE.SERVER_ERROR:
            case STATUS_CODE.BAD_GATEWAY:
              throw error
            default:
              Object.assign(message, {
                data,
                message: response?.data?.message || null,
              })
              onError(message)
              break
          }
          return message
        }

        // http status는 성공이지만 api status가 실패인 경우
        if (ApiError.isApiError(error)) {
          const result = ApiError.toApiErrorJSON(error.message)
          Object.assign(message, {
            data,
            message: result.message?.message || ApiError.getMessage('alert.common'),
          })
          onError(message)
          return message
        }

        onError(message)
        return message
      }
    },
    [options, fn],
  )

  return {
    loading,
    data,
    error,
    mutateAsync,
    setError,
    setLoading,
    setState,
  }
}
