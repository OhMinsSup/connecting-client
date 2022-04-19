import React, { useEffect, useMemo, useRef, useState } from 'react'

// constants
import { API_ENDPOINTS, MODAL_TYPE, STATUS_CODE } from '../../../constants'

// components
import Modal from './Modal'
import Overline from '../Form/Overline'
import InputBox from '../Form/InputBox'

// api
import { api } from '../../../api/module'

// hooks
import { useUrlState } from '../../../hooks/useUrlState'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from 'swr'

// validation
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../../libs/validation/schema'

// error
import { ApiError } from '../../../libs/error'

// types
import type { SubmitHandler } from 'react-hook-form'

interface FormFieldValues {
  name: string
}

interface WorkspaceAddProps {}

const WorkspaceAdd: React.FC<WorkspaceAddProps> = () => {
  const { mutate } = useSWRConfig()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [state, setState] = useUrlState<Record<string, string | null>>(
    {
      modalType: null,
    },
    {
      navigateMode: 'replace',
    },
  )

  const defaultValues = useMemo(
    () => ({
      name: '',
    }),
    [state],
  )

  const {
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FormFieldValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.worksacpe.add),
    defaultValues,
    criteriaMode: 'firstError',
  })

  const visible = state.modalType === MODAL_TYPE.CREATE_WORKSPACE

  /**
   * @description 모달 닫기 url state로 관리
   * @author veloss
   * @date 2022-02-24
   */
  const onClose = () => {
    setState({
      modalType: null,
    })
  }

  /**
   * @description form submit
   * @author veloss
   * @date 2022-02-24
   */
  const onSubmit: SubmitHandler<FormFieldValues> = async (input) => {
    try {
      setLoading(true)
      const { data } = await api.post<{ dataId: number }>({
        url: API_ENDPOINTS.WORKSPACES.ROOT,
        body: input,
      })
      setLoading(false)

      if (data.ok) {
        await mutate(API_ENDPOINTS.WORKSPACES.ROOT) // revalidate workspace list
        onClose()
        return
      }

      throw new ApiError(data)
    } catch (error) {
      setLoading(false)
      if (ApiError.isAxiosError(error)) {
        const { response } = error
        switch (response?.status) {
          case STATUS_CODE.SERVER_ERROR:
          case STATUS_CODE.BAD_GATEWAY:
            throw error
          default:
            setError(ApiError.getMessage('alert.common'))
            break
        }
        return
      }

      if (ApiError.isApiError(error)) {
        const { message } = ApiError.toApiErrorJSON(error.message)
        setError(message?.message || ApiError.getMessage('alert.common'))
        return
      }
    }
  }

  /**
   * @description 버튼 클릭시 submit 이벤트 강제 실행
   * @author veloss
   * @date 2022-02-24
   */
  const onClickForSubmit = () =>
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    )

  /**
   * @description unmount 이후 작업 폼 상태 초기화
   * @author veloss
   * @date 2022-02-24
   */
  useEffect(() => {
    return () => {
      setError('')
      clearErrors()
      reset(defaultValues)
    }
  }, [visible])

  return (
    <Modal
      visible={visible}
      padding
      title={'워크스페이스 만들기'}
      disabled={loading}
      disallowClosing
      actions={[
        {
          confirmation: true,
          children: '확인',
          onClick: onClickForSubmit,
        },
        {
          children: '취소',
          onClick: onClose,
        },
      ]}
      onClose={onClose}
    >
      <div>
        <form className="test" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <Overline formKey="name" errors={errors} block>
            워크스페이스 이름
          </Overline>
          <InputBox type="text" autoComplete="on" {...register('name')} />
          {error && (
            <Overline type="error" block style={{ color: 'var(--error)' }}>
              {error}
            </Overline>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default WorkspaceAdd
