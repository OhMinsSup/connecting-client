/* eslint-disable @typescript-eslint/ban-types */
import axios from 'axios'

// constants
import message from './message'

// utils
import { isEmpty, isUndefined } from '../utils'

// types
import type { AxiosError } from 'axios'
import type { Schema } from '../../api/schema/common'

// @ts-ignore
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? // @ts-ignore
      `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

interface ErrorResultData<T = any> extends Schema<T> {}

type ErrorMessagePath = NestedKeyOf<typeof message>

class ApiError extends Error {
  constructor(apiError: Record<string, any>, ...args: any[]) {
    super(...args)
    this.name = 'ApiError'
    if (!isEmpty(apiError)) {
      this.message = JSON.stringify(apiError)
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if ((Error as unknown as any).captureStackTrace) {
      // prettier-ignore
      (Error as unknown as any).captureStackTrace(this, ApiError)
    }
  }

  static isAxiosError(error: any): error is AxiosError<any> {
    return axios.isAxiosError(error)
  }

  static isApiError(error: any): error is ApiError {
    return error instanceof ApiError
  }

  static getMessage(path?: ErrorMessagePath | null) {
    if (!path) {
      return message.alert.common
    }

    const paths = path.split(/[,[\].]+?/).filter(Boolean)
    // array paths find message object get value
    const result = paths.reduce((acc, cur) => {
      if (isEmpty(cur)) {
        return acc
      }
      if (isUndefined(acc)) {
        return acc
      }
      return acc[cur as keyof {}]
    }, message)

    if (!result) {
      return message.alert.common
    }
    return result as unknown as string
  }

  static toApiErrorJSON(error: string) {
    let message: ErrorResultData | null = null
    try {
      message = error && typeof error === 'string' ? JSON.parse(error) : null
    } catch (error) {
      message = null
    }

    return {
      message,
    }
  }
}

export default ApiError
