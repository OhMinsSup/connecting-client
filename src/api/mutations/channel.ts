import { useCallback } from 'react'

// hooks
import { useProfileQuery } from '../../atoms/authState'
import { useMutation } from '../../libs/swr-utils'

// constants
import { API_ENDPOINTS } from '../../constants'

// api
import { api } from '../module'

export function useChannlesDeleteMutation() {
  const { profile } = useProfileQuery()

  // api
  const fetchDeleteChannel = async (workspaceIdx: string | number, channelIdx: string | number, body: any) => {
    const response = await api.delete({
      url: API_ENDPOINTS.CHANNELS.DELETE(workspaceIdx, channelIdx),
      body,
    })
    return response
  }

  const { mutateAsync, ...state } = useMutation(fetchDeleteChannel)

  const mutate = useCallback(
    async (workspaceIdx: string | number, channelIdx: string | number) => {
      // 로그인이 안된 경우 로그인 페이지로 이동 또는 에러 메시지 출력
      if (!profile) {
        return null
      }

      const result = await mutateAsync(workspaceIdx, channelIdx)

      if (!result.ok) {
        return result
      }

      return result
    },
    [profile],
  )

  return {
    ...state,
    mutate,
    fetchDeleteChannel,
  }
}
