import React, { useState } from 'react'

// hooks
import { Link } from 'react-router-dom'

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
import styles from '../../assets/styles/modules/auth.module.scss'
import wideSVG from '../../assets/svg/wide.svg'

import type { SubmitHandler } from 'react-hook-form'

const initialValues = {
  email: '',
}

interface EmailFormProps {
  isReset?: boolean
}
const EmailForm: React.FC<EmailFormProps> = ({ isReset }) => {
  const [err, setErr] = useState<string | boolean | undefined>()
  const [success, setSuccess] = useState<boolean>(false)

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid },
  } = useForm<typeof initialValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema.email),
    defaultValues: {
      ...initialValues,
    },
    criteriaMode: 'firstError',
  })

  const onSubmit: SubmitHandler<typeof initialValues> = async (input) => {
    try {
      setErr(false)
      setSuccess(false)

      const { data } = await api.post({
        url: API_ENDPOINTS.USERS.RESET_PASSWORD,
        body: input,
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
            <Overline formKey="email" errors={errors}>
              이메일
            </Overline>
            <InputBox type="text" placeholder="이메일을 입력하세요." className="fbc-has-badge" {...register('email')} />
          </>
          <Button type="submit" disabled={disabled}>
            {isReset ? '비밀번호 재설정' : '인증 메일 재전송'}
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
        title={'비밀번호 재설정'}
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
        title={'비밀번호 재설정'}
        actions={[
          {
            onClick: () => setSuccess(false),
            confirmation: true,
            children: '확인',
          },
        ]}
      >
        <div>이메일이 발송되었습니다.</div>
      </Modal>
    </>
  )
}

export default EmailForm
