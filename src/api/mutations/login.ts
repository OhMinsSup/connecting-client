// api
import { api } from '../module'

// contants
import { API_ENDPOINTS } from '../../constants'

// hooks
import { useNavigate } from 'react-router-dom'
import { useMutation } from '../../libs/swr-utils'
import { useMutateProfile } from '../../atoms/authState'
import { useCallback } from 'react'

interface Body {
  email: string
  password: string
}

interface Response {
  accessToken: string
}

const fetchLogin = async (body: Body) => {
  const response = await api.post<Response>({
    url: API_ENDPOINTS.USERS.LOGIN,
    body,
  })
  return response
}

/**
 * POST /v1/users/authentications/login
 * 회원관리 - 로그인
 * */
export function useLoginMutation() {
  const navigate = useNavigate()

  const setProfile = useMutateProfile()

  const { mutateAsync, ...state } = useMutation<Response>(fetchLogin)

  const mutate = useCallback(async (input: Body, redirect?: string) => {
    const result = await mutateAsync(input)

    const { data, ok } = result

    if (ok && data) {
      const {
        result: { accessToken },
      } = data
      localStorage.setItem('@@Connecting-Web-App/token', accessToken)
      await setProfile(accessToken)
      if (redirect) {
        navigate(redirect)
        return result
      }
      location.reload()
      return result
    }

    return result
  }, [])

  return {
    mutate,
    fetchLogin,
    ...state,
  }
}
