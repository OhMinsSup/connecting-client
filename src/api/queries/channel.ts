import noop from 'lodash-es/noop'

// hooks
import { useProfileQuery } from '../../atoms/authState'
import { laggy } from '../../libs/swr-utils'
import useSWR from 'swr'

// utils
import { isEmpty, isUndefined } from '../../libs/utils'

// constants
import { API_ENDPOINTS } from '../../constants'

// api
import { fetcher } from '../fetcher'

// types
import type { SWRConfiguration } from 'swr'
import type { ListSchema } from '../schema/common'
import type { ChannelListSchema } from '../schema/channle'
import type { ChannelSchema } from '../schema/model'

interface QueryConfig extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean
}

export function useChannlesQuery(workspaceIdx?: number | string | null, config: QueryConfig = {}) {
  const { enable = true, onError = noop, onSuccess = noop } = config

  const { profile } = useProfileQuery()

  const swrKeyLoader = () => {
    // enabled 이 false일 경우 가져오지 않음
    if (!enable) return null
    if (isEmpty(profile)) return null
    if (!workspaceIdx) return null
    return API_ENDPOINTS.CHANNELS.ROOT(workspaceIdx)
  }

  const wrappedFetcher = async (url: string) => {
    const body = await fetcher<ListSchema<ChannelListSchema>>(url)
    if (!body || (body && !body.ok)) return []
    const { result } = body
    return result.list
  }

  const { data, ...reset } = useSWR(swrKeyLoader, wrappedFetcher, {
    revalidateOnFocus: false,
    use: [laggy],
    suspense: true,
    onSuccess: (result) => {
      if (onSuccess) onSuccess(result)
    },
    onError: (error) => {
      if (onError) onError(error)
    },
  })

  const channels = data ?? []

  return {
    channels,
    isLoading: isUndefined(data) && !reset.error,
    ...reset,
  }
}

export function useChannleQuery(workspaceIdx?: number | string | null, channleIdx?: number | string | null, config: QueryConfig = {}) {
  const { onError = noop, onSuccess = noop } = config

  const { profile } = useProfileQuery()

  const swrKeyLoader = () => {
    if (isEmpty(profile)) return null
    if (!workspaceIdx || !channleIdx) return null
    return API_ENDPOINTS.CHANNELS.DELETE(workspaceIdx, channleIdx)
  }

  const wrappedFetcher = async (url: string) => {
    const body = await fetcher<ChannelSchema>(url)
    return body.result
  }

  const { data, ...reset } = useSWR(swrKeyLoader, wrappedFetcher, {
    revalidateOnFocus: false,
    use: [laggy],
    suspense: true,
    onSuccess: (result) => {
      if (onSuccess) onSuccess(result)
    },
    onError: (error) => {
      if (onError) onError(error)
    },
  })

  return {
    channel: data,
    isLoading: isUndefined(data) && !reset.error,
    ...reset,
  }
}
