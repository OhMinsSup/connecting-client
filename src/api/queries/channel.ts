import noop from 'lodash-es/noop'
import head from 'lodash-es/head'

// hooks
import { useProfileQuery } from '../../atoms/authState'
import useSWR from 'swr'

// utils
import { isEmpty } from '../../libs/utils'

// constants
import { API_ENDPOINTS } from '../../constants'

// api
import { fetcher } from '../fetcher'

import type { SWRConfiguration } from 'swr'
import type { ChannelSchema } from '../schema/model'
import type { ListSchema } from '../schema/common'

interface QueryConfig extends Pick<SWRConfiguration, 'onError' | 'onSuccess'> {
  enable?: boolean
}

export function useChannlesQuery(config: QueryConfig = {}) {
  const { enable = true, onError = noop, onSuccess = noop } = config

  const { profile } = useProfileQuery()

  const swrKeyLoader = () => {
    // enabled 이 false일 경우 가져오지 않음
    if (!enable) return null
    if (isEmpty(profile)) return null
    const myWorkspace = head(profile?.myWorkspaces)
    if (!myWorkspace) return null
    return API_ENDPOINTS.CHANNELS.ROOT(myWorkspace.idx)
  }

  const wrappedFetcher = async (url: string) => {
    const body = await fetcher<ListSchema<Pick<ChannelSchema, 'idx' | 'name' | 'createdAt' | 'updatedAt' | 'channelType'>>>(url)
    if (!body || (body && !body.ok)) return []
    const { result } = body
    return result.list
  }

  const { data, ...reset } = useSWR(swrKeyLoader, wrappedFetcher, {
    revalidateOnFocus: false,
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
    ...reset,
  }
}
