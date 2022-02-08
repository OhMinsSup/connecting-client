import noop from 'lodash-es/noop'

// hooks
import { useAuthValue } from '../../atoms/authState'
import useSWR, { useSWRConfig } from 'swr'

// api
import { fetcher } from '../fetcher'
import { API_ENDPOINTS } from '../../constants'

import type { SWRConfiguration } from 'swr'
import type { WorkspaceSchema } from '../schema/model'
import type { ListSchema } from '../schema/common'

export interface WorkspaceState extends Array<WorkspaceSchema> {}

interface QueryConfig extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean
}

export function useWorkspacesQuery(config: QueryConfig = {}) {
  const { cache } = useSWRConfig()

  const authState = useAuthValue()
  const { enable = true, onError = noop, onSuccess = noop } = config

  const swrKeyLoader = () => {
    // enabled 이 false일 경우 가져오지 않음
    if (!enable) return null
    // 로그인 상태가 아니면 null
    if (!authState.isLoggedIn) return null

    return API_ENDPOINTS.WORKSPACES.ROOT
  }

  const wrappedFetcher = async (url: string) => {
    const body = await fetcher<ListSchema<WorkspaceSchema>>(url)
    if (!body || (body && !body.ok)) return []
    const { result } = body
    return result.list
  }

  const { data, mutate } = useSWR(swrKeyLoader, wrappedFetcher, {
    refreshInterval: 0,
    onSuccess: (result) => {
      if (onSuccess) onSuccess(result)
    },
    onError: (error) => {
      if (onError) onError(error)
    },
  })

  const updateQuery = async () => {
    // 새로운 정보 요청
    await mutate()
  }

  const clearQuery = () => {
    if (cache.get(API_ENDPOINTS.WORKSPACES.ROOT)) {
      cache.delete(API_ENDPOINTS.WORKSPACES.ROOT)
    }
  }

  return {
    workspaces: data ?? [],
    updateQuery,
    clearQuery,
  }
}
