import { useEffect, useCallback } from 'react'
import { atom, useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'

import isEmpty from 'lodash-es/isEmpty'
import noop from 'lodash-es/noop'

// api
import { fetcher } from '../api/fetcher'
import { API_ENDPOINTS } from '../constants'
import { getToken } from '../libs/utils/utils'

import type { SWRConfiguration, Middleware } from 'swr'

export interface AuthState {
  isLoggedIn: boolean
  profile: Record<string, any> | null
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    profile: null,
  },
})

// useAuthState auth에 상태값 변경 및 가져오는 함수
export function useAuthState() {
  return useRecoilState(authState)
}

// useResetAuthState auth에 상태값 초기화 함수
export function useAuthResetState() {
  return useResetRecoilState(authState)
}

// useAuthSetState auth에 상태값 변경 함수
export function useAuthSetState() {
  return useSetRecoilState(authState)
}

interface ProfileConfig extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean
}

const middleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const extendedFetcher = (...args: any[]) => {
      const token = getToken()
      if (!token) {
        return Promise.resolve<any>(null)
      }
      return fetcher?.(...args)
    }

    return useSWRNext(key, extendedFetcher, config)
  }
}

export function useMutateProfile() {
  const setState = useAuthSetState()
  const { mutate } = useSWRConfig()

  return useCallback(async (token?: string) => {
    if (!token) {
      const error = new Error('Token is empty')
      error.name = 'EmptyToken'
      throw error
    }
    const thenFn = (data: any) => data.result ?? null
    // set validate cahce mutate swr
    const profile = await mutate(API_ENDPOINTS.USERS.ME, fetcher(API_ENDPOINTS.USERS.ME).then(thenFn))
    if (!profile) {
      setState({
        isLoggedIn: false,
        profile: null,
      })
      return
    }
    // set user profile one fetch
    setState({
      isLoggedIn: true,
      profile,
    })
  }, [])
}

export function useProfileQuery(config: ProfileConfig = {}) {
  const { enable = true, onError = noop, onSuccess = noop } = config

  const [state, setState] = useAuthState()
  const { cache } = useSWRConfig()

  const swrKeyLoader = () => {
    // enabled 이 false일 경우 가져오지 않음
    if (!enable) return null
    // 로그인 상태가 아니면 null
    if (!state.isLoggedIn) return null
    // 프로필이 존재하는 경우 null
    if (!isEmpty(state.profile)) return null

    return API_ENDPOINTS.USERS.ME
  }

  const wrappedFetcher = async (url: string) => {
    const body = await fetcher(url)
    if (!body || (body && !body.ok)) return null
    const { result } = body
    return result
  }

  const { mutate } = useSWR(swrKeyLoader, wrappedFetcher, {
    use: [middleware],
    revalidateOnFocus: false,
    onSuccess: (result) => {
      if (result) setState(result)
      if (onSuccess) onSuccess(result)
    },
    onError: (error) => {
      if (onError) onError(error)
    },
  })

  const updateProfile = async (profile?: Record<string, any> | null) => {
    if (profile) {
      // profile 정보가 존재하면 cache 데이터 업데이트
      await mutate(profile, false)
      setState((state) => ({
        ...state,
        profile,
      }))
    } else {
      setState((state) => ({
        ...state,
        profile: null,
      }))
      // 새로운 정보 요청
      await mutate()
    }
  }

  const clearProfile = () => {
    if (cache.get(API_ENDPOINTS.USERS.ME)) cache.delete(API_ENDPOINTS.USERS.ME)
    setState((state) => ({
      ...state,
      profile: null,
    }))
  }

  useEffect(() => {
    if (!state.profile) updateProfile()
  }, [state])

  return {
    profile: state.profile,
    updateProfile,
    clearProfile,
  }
}