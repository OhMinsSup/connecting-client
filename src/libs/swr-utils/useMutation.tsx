import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'

// utils
import { isFunction, isString } from '../utils/assertion'

import { RESULT_CODE } from '../../constants'

// error
import { ApiError } from '../error'

import type { AxiosResponse } from 'axios'
import type { Schema } from '../../api/schema/common'

type Fn = (...args: any[]) => Promise<AxiosResponse<Schema<any>>>

interface Mutation<R> {
  ok: boolean
  data: Schema<R> | null
  message?: string
}

interface Options<R = any> {
  invalidateKey?: string | ((data: Schema<R>) => string) // 요청이 성공하고 데이터를 invalidate를 할 때 사용
  deleteKey?: string // 요청이 성공하고 데이터를 삭제할 때 사용
  onSuccess?: (data: Schema<R>) => any // 요청이 성공 후 호출하는 함수
  onError?: (error: Mutation<R>) => any // 요청 후 에러가 발생하면 호출하는 함수
}

export function useMutation<T>(fn: Fn, options?: Options<T> | undefined) {
  const { cache, mutate } = useSWRConfig()

  const [data, setState] = useState<Schema<T> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Mutation<T> | null>(null)

  // 요청이 성공 후 deleteKey에 해당하는 데이터 삭제
  const onDeleteKey = useCallback(() => {
    if (options?.deleteKey && isString(options.deleteKey)) {
      if (cache.get(options.deleteKey)) cache.delete(options.deleteKey)
    }
  }, [cache, options?.deleteKey])

  const onInvalidateKey = useCallback(
    async (data: Schema<T>) => {
      // 성공시 데이터 패칭
      if (options?.invalidateKey) {
        if (isString(options.invalidateKey) || isFunction(options.invalidateKey)) {
          const key = isFunction(options.invalidateKey) ? options.invalidateKey(data) : options.invalidateKey
          await mutate(key)
        }
      }
    },
    [options, mutate],
  )

  const onSuccess = useCallback(
    async (data: Schema<T>) => {
      setState(data)
      // 성공시 콜백 호출
      if (isFunction(options?.onSuccess)) {
        if (options?.onSuccess instanceof Promise) {
          await options?.onSuccess(data)
        } else {
          options?.onSuccess(data)
        }
      }
    },
    [options],
  )

  const onError = useCallback(
    async (e: Mutation<T>) => {
      setError(e)
      // 실패시 콜백 호출
      if (isFunction(options?.onError)) {
        if (options?.onError instanceof Promise) {
          await options?.onError(e)
        } else {
          options?.onError(e)
        }
      }
    },
    [options],
  )

  const request = useCallback(
    async (...params: any[]) => {
      setState(null)
      setError(null)
      setLoading(true)
      const result = await fn(...params)
      setLoading(false)
      return result
    },
    [fn],
  )

  const mutateAsync = useCallback(
    async (...params: any[]): Promise<Mutation<T>> => {
      try {
        const result = await request(...params)
        const { status, data } = result
        if (status >= 200 && status < 300) {
          if (data.resultCode !== RESULT_CODE.OK) {
            throw new ApiError(data)
          }

          // 성공 시 캐시키 삭제
          onDeleteKey()

          // 성공시 데이터 패칭
          onInvalidateKey(data)

          // 성공시 콜백 호출
          onSuccess(data)

          return {
            ok: true,
            data,
            message: '',
          }
        }

        throw new ApiError(data)
      } catch (e) {
        setLoading(false)
        setState(null)

        const message: Mutation<T> = {
          ok: false,
          data: null,
          message: '',
        }

        // http status가 실패인 경우 서버 에러
        if (ApiError.isAxiosError(e)) {
          const data = ApiError.toAxiosErrorJSON(e)
          Object.assign(message, {
            data,
            message: data.message,
          })
          onError(message)
          return message
        }

        // http status는 성공이지만 api status가 실패인 경우
        if (ApiError.isApiError(e)) {
          const data = ApiError.toApiErrorJSON(e.message)
          Object.assign(message, {
            data: data,
            message: data?.message ?? e.message,
          })
          onError(message)
          return message
        }

        onError(message)
        return message
      }
    },
    [request, onDeleteKey, onInvalidateKey, onSuccess, onError],
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
