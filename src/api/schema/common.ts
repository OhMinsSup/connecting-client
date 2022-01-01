import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface Params<Body = any> {
  url: string
  body?: Body
  config?: AxiosRequestConfig | undefined
}

export interface Schema<Result = any> {
  ok: boolean
  resultCode: number
  message: string | null
  result: Result
}

export interface DataIdSchema {
  dataId: number
}

export interface ListSchema<Result = any> {
  list: Array<Result>
  total: number
  pageNo: number
}

export type DataIdParams = number | string | null | undefined

export type StoryApi<Result = any> = AxiosResponse<Schema<Result>>

export type StoryListApi<Result = any> = AxiosResponse<Schema<ListSchema<Result>>>

export type StoryErrorApi<Result = any> = AxiosError<Schema<Result>>

export type StoryDataIdApi = AxiosResponse<Schema<DataIdSchema>>
