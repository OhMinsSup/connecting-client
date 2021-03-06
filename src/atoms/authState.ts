import { useEffect, useCallback } from 'react'
import { atom, useRecoilState, useResetRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import useSWR, { useSWRConfig } from 'swr'

import isEmpty from 'lodash-es/isEmpty'
import noop from 'lodash-es/noop'
import { useIsomorphicLayoutEffect } from 'react-use'

// api
import { fetcher } from '../api/fetcher'
import { API_ENDPOINTS } from '../constants'

import type { SWRConfiguration, Middleware } from 'swr'
import type { MeSchema } from '../api/schema/model'

export interface AuthState {
  isLoggedIn: boolean
  profile: MeSchema | null
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    profile: null,
  },
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newID) => {
        console.log(`%c๐ณ [authState - state]:`, 'color: #66aee9;', newID)
      })
    },
  ],
})

// useAuthState auth์ ์ํ๊ฐ ๋ณ๊ฒฝ ๋ฐ ๊ฐ์ ธ์ค๋ ํจ์
export function useAuthState() {
  return useRecoilState(authState)
}

// useResetAuthState auth์ ์ํ๊ฐ ์ด๊ธฐํ ํจ์
export function useAuthResetState() {
  return useResetRecoilState(authState)
}

// useAuthSetState auth์ ์ํ๊ฐ ๋ณ๊ฒฝ ํจ์
export function useAuthSetState() {
  return useSetRecoilState(authState)
}

// useAuthValue auth์ ์ํ๊ฐ ๊ฐ์ ธ์ค๋ ํจ์
export function useAuthValue() {
  return useRecoilValue(authState)
}

interface ProfileConfig extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean
}

const middleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const extendedFetcher = (...args: any[]) => {
      const token = localStorage.getItem('@@Connecting-Web-App/token')
      if (!token || typeof token !== 'string') {
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

  useIsomorphicLayoutEffect(() => {
    const promise = async () => {
      const token = localStorage.getItem('@@Connecting-Web-App/token')
      if (!token) {
        setState((state) => ({
          ...state,
          isLoggedIn: false,
        }))
        return
      } else {
        setState((state) => ({
          ...state,
          isLoggedIn: true,
        }))
      }
    }
    promise()
  }, [])

  const swrKeyLoader = () => {
    // enabled ์ด false์ผ ๊ฒฝ์ฐ ๊ฐ์ ธ์ค์ง ์์
    if (!enable) return null
    // ๋ก๊ทธ์ธ ์ํ๊ฐ ์๋๋ฉด null
    if (!state.isLoggedIn) return null
    // ํ๋กํ์ด ์กด์ฌํ๋ ๊ฒฝ์ฐ null
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
      if (result) setState((state) => ({ ...state, profile: result }))
      if (onSuccess) onSuccess(result)
    },
    onError: (error) => {
      if (onError) onError(error)
    },
  })

  const updateProfile = async (profile?: MeSchema | null) => {
    if (profile) {
      // profile ์ ๋ณด๊ฐ ์กด์ฌํ๋ฉด cache ๋ฐ์ดํฐ ์๋ฐ์ดํธ
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
      // ์๋ก์ด ์ ๋ณด ์์ฒญ
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
  }, [state.profile])

  return {
    profile: state.profile,
    updateProfile,
    clearProfile,
  }
}
