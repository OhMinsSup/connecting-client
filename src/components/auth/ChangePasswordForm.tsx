import React, { useState } from 'react'

// hooks
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

// validator
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../libs/validation/schema'

import { api } from '../../api/module'
import { API_ENDPOINTS, PAGE_ENDPOINTS } from '../../constants'
import { isAxiosError } from '../../libs/utils/utils'

// components
import Overline from '../ui/Overline'
import InputBox from '../ui/InputBox'
import Button from '../ui/Button'
import Legal from './Legal'
import Modal from '../ui/Modal'

// styles
import styles from './style/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

import type { SubmitHandler } from 'react-hook-form'

const initialValues = {
  password: '',
  passwordConfirm: '',
}

interface ChangePasswordFormProps {}
const ChangePasswordForm: React.FC<ChangePasswordFormProps> = () => {
  const [err, setErr] = useState<string | boolean | undefined>()
  const [success, setSuccess] = useState<boolean>(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<typeof initialValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.changePassword),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<typeof initialValues> = async (input) => {
    try {
      setErr(false)
      setSuccess(false)

      const { data } = await api.put({
        url: API_ENDPOINTS.USERS.CHANGE_PASSWORD,
        body: {
          ...input,
          code,
        },
      })

      if (data.ok) {
        setSuccess(true)
        return
      } else {
        const error = new Error()
        error.name = 'ApiError'
        error.message = JSON.stringify(data)
        throw error
      }
    } catch (error) {
      if (isAxiosError(error)) {
        setErr(true)
        throw error
      } else if (error instanceof Error && error.name === 'ApiError') {
        const { message } = JSON.parse(error.message)
        setErr(message)
      }
    }
  }

  const disabled = !isDirty || !isValid

  return (
    <>
      <div className={styles.form}>
        <img src={wideSVG} alt="wide" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <>
            <Overline formKey="password" errors={errors}>
              비밀번호
            </Overline>
            <InputBox type="password" autoComplete="on" placeholder="비밀번호를 입력하세요." className="fbc-has-badge" {...register('password')} />
          </>
          <>
            <Overline formKey="passwordConfirm" errors={errors}>
              비밀번호 확인
            </Overline>
            <InputBox type="password" autoComplete="on" placeholder="비밀번호 확인을 입력하세요." className="fbc-has-badge" {...register('passwordConfirm')} />
          </>
          <Button type="submit" disabled={disabled}>
            비밀번호 변경하기
          </Button>
        </form>
        <span className={styles.create}>
          <Link to={PAGE_ENDPOINTS.LOGIN.ROOT}>로그인으로 돌아가기.</Link>
        </span>
        <Legal />
      </div>
      {/* 오류 알럿 */}
      <Modal
        visible={!!err}
        onClose={() => false}
        title={'비밀번호 변경하기'}
        actions={[
          {
            onClick: () => setErr(false),
            confirmation: true,
            children: '확인',
          },
        ]}
      >
        {typeof err === 'string' ? (
          err
        ) : (
          <div>
            에러가 발생했습니다
            <br />
            다시 한번 시도해주세요.
          </div>
        )}
      </Modal>
      {/* 발송 성공 */}
      <Modal
        visible={success}
        onClose={() => false}
        title={'비밀번호 변경하기'}
        actions={[
          {
            onClick: () => {
              setSuccess(false)
              navigate(PAGE_ENDPOINTS.LOGIN.ROOT)
            },
            confirmation: true,
            children: '확인',
          },
        ]}
      >
        <div>비밀번호가 변경되었습니다.</div>
      </Modal>
    </>
  )
}

export default ChangePasswordForm
