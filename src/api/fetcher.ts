import { api } from './module'

export const fetcher = async <R = any>(url: string) => {
  const response = await api.getResponse<R>({
    url,
  })
  return response.data
}
