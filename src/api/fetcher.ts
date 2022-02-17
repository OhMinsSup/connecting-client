import { api } from './module'

export const fetcher = async <R = any>(url: string) => {
  const response = await api.get<R>({
    url,
  })
  return response.data
}

export const fetcherResult = async <R = any>(url: string) => {
  const response = await api.get<R>({
    url,
  })
  return response.data?.result
}
