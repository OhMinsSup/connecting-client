import { atom, useRecoilState, useResetRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

import noop from 'lodash-es/noop'

// hooks
import useSWR, { useSWRConfig } from 'swr'
import { useAuthValue } from './authState'

// api
import { fetcher } from '../api/fetcher'
import { API_ENDPOINTS } from '../constants'

import type { SWRConfiguration } from 'swr'
import type { WorkspaceSchema } from '../api/schema/model'
import type { ListSchema } from '../api/schema/common'

export interface WorkspaceState extends Array<WorkspaceSchema> {}

export const workspaceState = atom<WorkspaceState>({
  key: 'workspaceState',
  default: [],
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newID) => {
        console.debug(`%c🏔 [workspaceState - state]:`, 'color: #63e6be;', newID)
      })
    },
  ],
})

// useWorkspaceState workspaceState에 상태값 변경 및 가져오는 함수
export function useWorkspaceState() {
  return useRecoilState(workspaceState)
}

// useWorkspaceResetState workspaceState에 상태값 초기화 함수
export function useWorkspaceResetState() {
  return useResetRecoilState(workspaceState)
}

// useWorkspaceSetState workspaceState에 상태값 변경 함수
export function useWorkspaceSetState() {
  return useSetRecoilState(workspaceState)
}

// useWorkspaceValue workspaceState에 상태값 가져오는 함수
export function useWorkspaceValue() {
  return useRecoilValue(workspaceState)
}

interface QueryConfig extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean
}

export function useWorkspacesQuery(config: QueryConfig = {}) {
  const { cache } = useSWRConfig()

  const authState = useAuthValue()
  const [state, setState] = useWorkspaceState()
  const reset = useWorkspaceResetState()

  const { enable = true, onError = noop, onSuccess = noop } = config

  const swrKeyLoader = () => {
    // enabled 이 false일 경우 가져오지 않음
    if (!enable) return null
    // 로그인 상태가 아니면 null
    if (!authState.isLoggedIn) return null
    // 이미 존재하는 경우 가져오지 않음
    if (state.length) return null

    return API_ENDPOINTS.WORKSPACES.ROOT
  }

  const wrappedFetcher = async (url: string) => {
    const body = await fetcher<ListSchema<WorkspaceSchema>>(url)
    if (!body || (body && !body.ok)) return []
    const { result } = body
    return result.list
  }

  const { mutate } = useSWR(swrKeyLoader, wrappedFetcher, {
    refreshInterval: 0,
    onSuccess: (result) => {
      if (result && result.length) setState(result)
      if (onSuccess) onSuccess(result)
    },
    onError: (error) => {
      if (onError) onError(error)
    },
  })

  const updateQuery = async () => {
    // clear recoil state
    reset()
    // 새로운 정보 요청
    await mutate()
  }

  const clearQuery = () => {
    if (cache.get(API_ENDPOINTS.WORKSPACES.ROOT)) {
      cache.delete(API_ENDPOINTS.WORKSPACES.ROOT)
    }
    reset()
  }

  return {
    workspaces: state,
    updateQuery,
    clearQuery,
  }
}
